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
import type { IWorkspaceBoardFile } from "./workspace";
import type { IBoard } from "../types";

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
   * Opens the board.
   */
  async open() {
  }
}
