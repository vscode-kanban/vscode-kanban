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

import type AppContext from "../classes/appContext";
import type { Disposable } from 'vscode';

/**
 * A command action.
 */
export type CommandAction = (...args: any[]) => any;

/**
 * A function, which create a new `ICommand` instance.
 * 
 * @param {ICommandFactoryOptions} options The options.
 * 
 * @returns {ICommand|Thenable<ICommand>} The new command.
 */
export type CommandFactory = (options: ICommandFactoryOptions) => ICommand | Thenable<ICommand>;

/**
 * Options for `CommandFactory` function.
 */
export interface ICommandFactoryOptions {
  /**
   * The underlying app.
   */
  readonly app: AppContext;
}

/**
 * Options for `ICommand.initialize()` method.
 */
export interface IInitializeCommandOptions {
  /**
   * The underlying app.
   */
  readonly app: AppContext;
}

/**
 * A command.
 */
export interface ICommand extends Disposable {
  /**
   * Initializes the module.
   *
   * @param {IInitializeCommandOptions} options The options.
   * 
   * @returns {Thenable<CommandAction>|CommandAction} The command action.
   */
  initialize(options: IInitializeCommandOptions): Thenable<CommandAction> | CommandAction;

  /**
   * The (internal) name of the module.
   */
  name: string;
}
