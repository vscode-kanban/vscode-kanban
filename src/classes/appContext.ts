/**
 * This file is part of the vscode-kanban distribution.
 * Copyright (c) Marcel Joachim Kloubert.
 *
 * vscode-kanban is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * vscode-kanban is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import DisposableBase from './disposableBase';
import i18n, {
  InitOptions as I18InitOptions,
  Resource as TranslationResource,
  ResourceLanguage as TranslationResourceLanguage,
  TFunction
} from 'i18next';
import os from 'os';
import path from 'path';
import vscode from 'vscode';
import Workspace from './workspace';
import type { CommandFactory } from '../commands';
import { defaultLanguage, kanbanName, kanbanStyleFilename } from '../constants';
import type { CanBeNull } from '../types';

/**
 * Options for `AppContext` class.
 */
export interface IAppContextOptions {
  /**
   * The underlying extension context.
   */
  readonly extension: vscode.ExtensionContext;
}

/**
 * The application context.
 */
export default class AppContext extends DisposableBase {
  protected _t: TFunction = (key) => key;  // start with dummy function
  protected _tSettings: CanBeNull<I18InitOptions> = null;
  protected _workspaces: Workspace[] = [];

  /**
   * Initializes a new instance of that class.
   *
   * @param {IAppContextOptions} options The options.
   */
  constructor(public readonly options: IAppContextOptions) {
    super();

    this._disposabled.push(
      this.output = vscode.window.createOutputChannel('Kanban')
    );
  }

  /**
   * Possible URI for a `${HOME}/.vscode-kanban/vscode-kanban.css` file.
   */
  get customCSSFileUri(): vscode.Uri {
    return vscode.Uri.joinPath(
      this.homeFolderUri, kanbanStyleFilename
    );
  }

  /**
   * @inheritdoc
   */
  dispose() {
    super.dispose();

    // dispose workspaces
    while (this._workspaces.length) {
      this._workspaces.pop()?.dispose();
    }
  }

  /**
   * Gets the underlying extension context.
   */
  get extension(): vscode.ExtensionContext {
    return this.options.extension;
  }

  /**
   * Gets the possible URI of the `.vscode-kanban` subfolder
   * inside the home directory of the current user.
   */
  get homeFolderUri(): vscode.Uri {
    const homeDirUri = vscode.Uri.file(os.homedir());

    return vscode.Uri.joinPath(homeDirUri, `.${kanbanName}`);
  }

  /**
   * Returns the root URI of the media folder.
   */
  get mediaFolderUri(): vscode.Uri {
    return vscode.Uri.joinPath(this.extension.extensionUri, 'media');
  }

  /**
   * The underlying output channel.
   */
  readonly output: vscode.OutputChannel;

  /**
   * Registers a command.
   */
  async registerCommand(factory: CommandFactory) {
    const command = await Promise.resolve(factory({
      app: this
    }));

    const action = await Promise.resolve(command.initialize({
      app: this
    }));

    const { name } = command;
    const fullCommandName = `extension.kanban.${name}`;

    this._disposabled.push(
      vscode.commands.registerCommand(fullCommandName, async (...args: any[]) => {
        try {
          return await action(...args);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Command '${name}' failed: ${error}`
          );
        }
      }),
      command
    );
  }

  /**
   * Starts the app.
   */
  async start() {
    const { fs } = vscode.workspace;

    // ${HOME}/.vscode-kanban subfolder
    await (async () => {
      const homeDirUri = this.homeFolderUri;
      try {
        const stat = await fs.stat(homeDirUri);
        if (stat.type === vscode.FileType.File) {
          throw vscode.FileSystemError.FileNotADirectory(homeDirUri);
        }
      } catch (error) {
        if (error instanceof vscode.FileSystemError) {
          if (error.code === 'FileNotFound') {
            await fs.createDirectory(homeDirUri);

            return;
          }
        }

        throw error;
      }
    })();

    vscode.workspace.workspaceFolders?.forEach((wsf) => {
      this.addWorkspace(wsf);
    });

    const i18NextFolder = vscode.Uri.joinPath(this.extension.extensionUri, 'i18n');

    const translationResource: TranslationResource = {
    };

    const filesAndFolders = await fs.readDirectory(i18NextFolder);
    for (const [item, type] of filesAndFolders) {
      if (type === vscode.FileType.Directory) {
        continue;
      }
      if (!item.endsWith('.json')) {
        continue;
      }

      const fullUri = vscode.Uri.joinPath(i18NextFolder, item);
      const langName = path.basename(item, path.extname(item));

      const translation: TranslationResourceLanguage = JSON.parse(
        Buffer.from(await fs.readFile(fullUri)).toString('utf8')
      );

      translationResource[langName] = {
        translation
      };
    }

    let currentLang = (vscode.env.language || '').split('-')[0].toLowerCase().trim();
    currentLang = currentLang || defaultLanguage;

    const tOpts: I18InitOptions = {
      resources: translationResource,
      supportedLngs: Object.keys(translationResource),
      fallbackLng: defaultLanguage,
      interpolation: {
        escapeValue: false // react already safes from xss
      },
      lng: currentLang
    };

    this._t = await i18n.init(tOpts);
    this._tSettings = tOpts;
  }

  /**
   * Returns the function, whichs returns translated strings.
   */
  get t(): TFunction {
    return this._t;
  }

  /**
   * Returns a copy of the settings for `t()` function.
   */
  get tSettings(): CanBeNull<I18InitOptions> {
    return this._tSettings ? JSON.parse(
      JSON.stringify(this._tSettings)
    ) : null;
  }

  /**
   * Gets a copy of the current list of workspaces.
   *
   * @returns {Workspace[]} The workspaces.
   */
  get workspaces(): Workspace[] {
    return [...this._workspaces];
  }

  /// private methods

  addWorkspace(folder: vscode.WorkspaceFolder) {
    const newWS = new Workspace({
      "app": this,
      folder
    });

    this._workspaces.push(newWS);

    newWS.init();
  }

  onDidChangeConfiguration(ev: vscode.ConfigurationChangeEvent) {
    this.workspaces.forEach((ws) => {
      return ws.onDidChangeConfiguration(ev);
    });
  }

  onDidChangeWorkspaceFolders(ev: vscode.WorkspaceFoldersChangeEvent) {
    // remove
    ev.removed.forEach((removedWS) => {
      const machtingWorkspaces = this._workspaces.filter((ws) => {
        return ws.folder.index === removedWS.index;
      });

      machtingWorkspaces.forEach((matchingWS) => {
        this._workspaces = this._workspaces.filter((ws) => {
          return ws.folder.index !== matchingWS.folder.index;
        });

        matchingWS.dispose();
      });
    });

    // add
    ev.added.forEach((folder) => {
      this.addWorkspace(folder);
    });
  }
}
