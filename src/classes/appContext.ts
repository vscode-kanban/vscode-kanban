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
import vscode from 'vscode';
import type { CommandFactory } from '../commands';

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
  /**
   * Initializes a new instance of that class.
   *
   * @param {IAppContextOptions} options The options.
   */
  constructor(public readonly options: IAppContextOptions) {
    super();
  }

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

    const fullCommandName = `extension.kanban.${command.name}`;

    this._disposabled.push(
      vscode.commands.registerCommand(fullCommandName, action),
      command
    );
  }
}
