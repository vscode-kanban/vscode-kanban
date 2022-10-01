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
import type { IBoard } from "../types";
import { getNonce } from "../utils";

const { fs } = vscode.workspace;

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
        ]
      }
    );

    this._disposabled.push(newPanel);

    newPanel.webview.html = await this.getHTML();
    newPanel.iconPath = vscode.Uri.joinPath(this.mediaFolderUri, 'icon.png');
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
    const { webview } = this._panel;

    const nonce = getNonce();

    const rootUri = webview.asWebviewUri(this.mediaFolderUri);
    const globalScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.mediaFolderUri, "main.js"));
    const componentsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.mediaFolderUri, "components"));

    const mainEJSUri = vscode.Uri.joinPath(this.mediaFolderUri, 'main.ejs');

    return ejs.render(
      Buffer.from(await fs.readFile(mainEJSUri)).toString('utf8'),
      {
        componentsUri: componentsUri.toString(),
        globalScriptUri: globalScriptUri.toString(),
        nonce,
        rootUri: rootUri.toString(),
        title: this.title
      }
    );
  }
}
