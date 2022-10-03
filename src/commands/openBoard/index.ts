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

import KanbanBoard from '../../classes/kanbanBoard';
import path from 'path';
import vscode from 'vscode';
import type { CommandFactory } from "..";
import type { IWorkspaceBoardFile } from '../../classes/workspace';

interface IWorkspaceBoardFileQuickPickItem extends vscode.QuickPickItem {
  file: IWorkspaceBoardFile;
}

const factory: CommandFactory = () => {
  let openBoards: KanbanBoard[] = [];

  return {
    initialize(options) {
      const { app } = options;

      return async () => {
        const { fs } = vscode.workspace;
        const { t } = app;

        const possibleWorkspacesWithBoards = app.workspaces.map((ws) => {
          return ws.tryGetBoardFile();
        }).filter((ws) => ws !== false) as IWorkspaceBoardFile[];

        const qpItems: IWorkspaceBoardFileQuickPickItem[] = possibleWorkspacesWithBoards.map((file) => {
          return {
            file,
            label: file.workspace.folder.name,
          };
        });

        if (qpItems.length) {
          let selectedItem: IWorkspaceBoardFileQuickPickItem | null | undefined;
          if (qpItems.length === 1) {
            selectedItem = qpItems[0];
          } else {
            selectedItem = await vscode.window.showQuickPick<IWorkspaceBoardFileQuickPickItem>(qpItems);
          }

          if (!selectedItem) {
            return;
          }

          const { file } = selectedItem;
          // folder
          try {
            await fs.stat(file.folderUri);
          } catch (error) {
            if (error instanceof vscode.FileSystemError) {
              if (error.code !== 'FileNotFound') {
                throw error;
              }
            }

            if (fs.isWritableFileSystem(file.folderUri.scheme)) {
              // try create directory
              await fs.createDirectory(file.folderUri);
            } else {
              throw vscode.FileSystemError.NoPermissions(file.folderUri);
            }
          }
          // file
          try {
            await fs.stat(file.fileUri);
          } catch (error) {
            if (error instanceof vscode.FileSystemError) {
              if (error.code !== 'FileNotFound') {
                throw error;
              }
            }

            if (fs.isWritableFileSystem(file.fileUri.scheme)) {
              // try create empty file

              await fs.writeFile(
                file.fileUri,
                Buffer.from(JSON.stringify(
                  KanbanBoard.createEmpty()
                ), 'utf8')
              );
            } else {
              throw vscode.FileSystemError.NoPermissions(file.fileUri);
            }
          }

          const newBoard = new KanbanBoard({
            file: selectedItem.file,
          });
          newBoard.onDispose = () => {
            openBoards = openBoards.filter((board) => board !== newBoard);
          };

          await newBoard.open();
          openBoards.push(newBoard);
        } else {
          vscode.window.showWarningMessage(
            t('errors.no_board_compatible_workspace_found')
          );
        }
      };
    },

    dispose() {
      while (openBoards.length) {
        openBoards.pop()?.dispose();
      }
    },

    name: path.basename(__dirname),
  };
};

export default factory;
