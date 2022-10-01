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

import type { Disposable } from 'vscode';

/**
 * A basic disposable object.
 */
export default abstract class DisposableBase implements Disposable {
  /**
   * List of internal `Disposable`s, which should be handled by
   * `dispose()` method of that instance.
   */
  protected readonly _disposabled: Disposable[] = [];

  /**
   * @inheritdoc
   */
  dispose() {
    while (this._disposabled.length) {
      this._disposabled.pop()?.dispose();
    }
  }
}
