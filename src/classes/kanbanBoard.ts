/* eslint-disable @typescript-eslint/naming-convention */

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

import DisposableBase from "./disposableBase";
import ejs from 'ejs';
import vscode from "vscode";
import type Workspace from "./workspace";
import type { IWorkspaceBoardFile } from "./workspace";
import type { CanBeNullOrUndefined, IBoard } from "../types";
import { getNonce } from "../utils";

interface IKanbanBoardMessage<TData = any> {
  type: string;
  data: TData;
}

/**
 * Options for `KanbanBoard` class.
 */
export interface IKanbanBoardOptions {
  /**
   * The underlying file.
   */
  readonly file: IWorkspaceBoardFile;
}

/**
 * A kanban board.
 */
export default class KanbanBoard extends DisposableBase {
  private _panel!: vscode.WebviewPanel;

  /**
   * Initializes a new instance of that class.
   *
   * @param {IKanbanBoardOptions} options The options.
   */
  constructor(public readonly options: IKanbanBoardOptions) {
    super();
  }

  /**
   * Creates an empty instance.
   *
   * @returns {IBoard} The new instance.
   */
  static createEmpty(): IBoard {
    return {
      "todo": [],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      "in-progress": [],
      "testing": [],
      "done": []
    };
  }

  /**
   * Get the underlying board file.
   */
  get file(): IWorkspaceBoardFile {
    return this.options.file;
  }

  /**
   * Returns the root URI of the media folder.
   */
  get mediaFolderUri(): vscode.Uri {
    return this.file.workspace.app.mediaFolderUri;
  }

  /**
   * Opens the board.
   */
  async open() {
    const newPanel = this._panel = vscode.window.createWebviewPanel(
      'vscodeKanbanBoard',
      this.title,
      vscode.ViewColumn.One,
      {
        enableCommandUris: true,
        enableForms: true,
        enableScripts: true,
        enableFindWidget: true,
        localResourceRoots: [
          this.mediaFolderUri
        ],
        retainContextWhenHidden: true
      }
    );

    this._disposabled.push(newPanel);

    newPanel.webview.html = await this.getHTML();
    newPanel.iconPath = vscode.Uri.joinPath(this.mediaFolderUri, 'img/icon.png');

    newPanel.webview.onDidReceiveMessage(this.onDidReceiveMessage.bind(this));
  }

  /**
   * Gets the title.
   */
  get title(): string {
    return `[Kanban] ${this.file.workspace.folder.name}`;
  }

  /**
   * Returns the underlying workspace.
   */
  get workspace(): Workspace {
    return this.file.workspace;
  }

  /// private methods ...

  private async getHTML(): Promise<string> {
    const { fs } = vscode.workspace;
    const { webview } = this._panel;

    const nonce = getNonce();

    const colorMode = vscode.window.activeColorTheme.kind.toString().endsWith('Light') ?
      'light' :
      'dark';

    const jsxFolderUri = vscode.Uri.joinPath(this.mediaFolderUri, "jsx");
    const componentsFolderUri = vscode.Uri.joinPath(jsxFolderUri, "components");

    const rootUri = webview.asWebviewUri(this.mediaFolderUri);
    const componentsUri = webview.asWebviewUri(componentsFolderUri);

    const mainEJSUri = vscode.Uri.joinPath(this.mediaFolderUri, 'main.ejs');
    const mainEJS = Buffer.from(
      await fs.readFile(mainEJSUri)
    ).toString('utf8');

    const jsxComponentUris: vscode.Uri[] = [];
    {
      const listOfJsxFoldersToScan: vscode.Uri[] = [
        componentsFolderUri,
        jsxFolderUri
      ];

      for (const jsxUri of listOfJsxFoldersToScan) {
        for (const [item, type] of await fs.readDirectory(jsxUri)) {
          if (type === vscode.FileType.Directory) {
            continue;
          }

          if (item.endsWith('.jsx')) {
            const fullUri = vscode.Uri.joinPath(jsxUri, item);

            jsxComponentUris.push(
              webview.asWebviewUri(fullUri)
            );
          }
        }
      }
    }

    return ejs.render(
      mainEJS,
      {
        colorMode,
        componentsUri: componentsUri.toString(),
        cspSource: webview.cspSource,
        jsxComponentUris: jsxComponentUris.map((jsxUri) => jsxUri.toString()),
        nonce,
        rootUri: rootUri.toString(),
        title: this.title
      }
    );
  }

  private async loadBoardSafe(): Promise<IBoard> {
    const { fs } = vscode.workspace;

    let board: CanBeNullOrUndefined<IBoard>;

    try {
      board = JSON.parse(
        Buffer.from(await fs.readFile(this.file.fileUri)).toString('utf8')
      );
    } catch (error) {
      // TODO: log
    }

    return board || KanbanBoard.createEmpty();
  }

  private async onDidReceiveMessage(ev: IKanbanBoardMessage) {
    const { fs } = vscode.workspace;

    try {
      switch (ev.type) {
        case 'onBoardUpdated':
          {
            const newBoard = ev.data as IBoard;
            const newBoardJSON = JSON.stringify(newBoard, null, 2);

            await fs.writeFile(this.file.fileUri, Buffer.from(newBoardJSON, 'utf8'));
          }
          break;

        case 'onPageLoaded':
          {
            await this.postMsg(
              'onBoardUpdated',
              await this.loadBoardSafe()
            );
          }
          break;
      }
    } catch (error) {
      // TODO: log
    }
  }

  private postMsg(type: string, data?: any) {
    return this._panel.webview.postMessage({
      type, data
    });
  }
}
