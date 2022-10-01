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

import type AppContext from "./appContext";
import DisposableBase from "./disposableBase";
import vscode from 'vscode';
import { kanbanFilename } from "../constants";

/**
 * A workspace board file.
 */
export interface IWorkspaceBoardFile {
  /**
   * The file URI.
   */
  fileUri: vscode.Uri;
  /**
   * The folder URI.
   */
  folderUri: vscode.Uri;
  /**
   * The underlying workspace.
   */
  workspace: Workspace;
}

/**
 * Options for `Workspace` class.
 */
export interface IWorkspaceOptions {
  /**
   * The underlying app instance.
   */
  readonly app: AppContext;
  /**
   * The underlying folder instance.
   */
  readonly folder: vscode.WorkspaceFolder;
}

/**
 * Handles a workspace.
 */
export default class Workspace extends DisposableBase {
  /**
   * Initializes a new instance of that class.
   *
   * @param {IWorkspaceOptions} options The options.
   */
  constructor(public readonly options: IWorkspaceOptions) {
    super();
  }

  /**
   * Gets the underlying folder instance.
   */
  get folder(): vscode.WorkspaceFolder {
    return this.options.folder;
  }

  /**
   * Initializes the workspace.
   */
  init() { }

  /**
   * Gets if this workspace is the current/active one.
   */
  get isCurrent(): boolean {
    return !!vscode.window.activeTextEditor?.document?.uri?.fsPath.startsWith(
      this.folder.uri.fsPath
    );
  }

  /**
   * Is used to report configuration changes.
   *
   * @param {vscode.ConfigurationChangeEvent} ev The event arguments.
   */
  onDidChangeConfiguration(ev: vscode.ConfigurationChangeEvent) {
    // TODO: implement
  }

  /**
   * Tries to return the information of an existing board file inside that workspace.
   *
   * @returns {IWorkspaceBoardFile|false} The information for a possible file or `false` if failed.
   */
  tryGetBoardFile(): IWorkspaceBoardFile | false {
    try {
      const kanbanFolderUri = vscode.Uri.joinPath(this.folder.uri, '.vscode');
      const kanbanFileUri = vscode.Uri.joinPath(kanbanFolderUri, kanbanFilename);

      return {
        fileUri: kanbanFileUri,
        folderUri: kanbanFolderUri,
        workspace: this
      };
    } catch {
      return false;
    }
  }
}
