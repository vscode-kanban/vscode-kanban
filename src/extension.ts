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

// Day.js
import dayJS from 'dayjs';
import dayJS_isoWeek from 'dayjs/plugin/isoWeek';
import dayJS_advancedFormat from 'dayjs/plugin/advancedFormat';
import dayJS_customParseFormat from 'dayjs/plugin/customParseFormat';
import dayJS_timezone from 'dayjs/plugin/timezone';
import dayJS_utc from 'dayjs/plugin/utc';
dayJS.extend(dayJS_isoWeek);
dayJS.extend(dayJS_advancedFormat);
dayJS.extend(dayJS_customParseFormat);
dayJS.extend(dayJS_timezone);
dayJS.extend(dayJS_utc);

import AppContext from './classes/appContext';
import vscode from 'vscode';

import openBoardCommand from './commands/openBoard';

// code to activate the extension
export async function activate(context: vscode.ExtensionContext) {
	const app = new AppContext({
		extension: context
	});

	await app.registerCommand(openBoardCommand);

	context.subscriptions.push(app);

	await app.start();
}

// code to deactivate the extension
export async function deactivate() { }
