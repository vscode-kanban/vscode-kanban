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

window.vscode = acquireVsCodeApi();
window.t = (key) => key;  // start with a dummy t() function

/**
 * Posts a message back to VSCode.
 *
 * @param {String} type The type of the message. 
 * @param {any} [data] The custom and optional data to send. 
 */
function postMsg(type, data) {
  return window.vscode.postMessage({
    type,
    data
  });
}

/**
 * Board settings and functions.
 */
window.vscodeKanban = {
  board: null,
  ui: {
    components: {},
    icon: null
  }
};

/**
 * Assigns card data to an object.
 *
 * @param {Object} card The target (card) object. 
 * @param {Object} data The data to assign.
 *
 * @returns {Object} The object with the assigned data.
 */
window.vscodeKanban.assignCardData = function (card, data) {
  card.assignedTo = data.assignedTo ? {
    name: data.assignedTo,
  } : null;
  card.category = data.category;
  card.description = data.description ? {
    content: data.description,
    mime: 'text/markdown',
  } : null;
  card.details = data.details ? {
    content: data.details,
    mime: 'text/markdown',
  } : null;
  card.prio = data.prio || 0;
  card.references = data.references?.length ?
    [...data.references] :
    null;
  card.title = data.title;
  card.type = data.type;

  if (data.id) {
    card.id = String(data.id);
  }
  if (data.creation_time) {
    card.creation_time = String(data.creation_time);
  }

  return card;
};

/**
 * Finds the next, unused numeric ID inside a board.
 *
 * @param {Object} board The board.
 *
 * @returns {String} The next ID.
 */
window.vscodeKanban.findNextCardId = function (board) {
  const numericIds = this.getAllCards(board)
    .map((card) => parseInt(String(card.id).trim(), 10))
    .filter((id) => !isNaN(id));

  let lastId = 0;
  if (numericIds.length) {
    lastId = Math.max(...numericIds);
  }

  return String(lastId + 1);
};

/**
 * Returns a flat list of all cards of a board.
 *
 * @param {Object} board The board.
 *
 * @returns {Object[]} The flat list of cards.
 */
window.vscodeKanban.getAllCards = function (board) {
  return Object.values(board || {})
    .flat();
};

/**
 * Gets the background class based on the color mode.
 *
 * @returns {String} The class name.
 */
window.vscodeKanban.getBGClass = function () {
  return `bg-${this.colorMode}`;
};

/**
 * Returns a list of JSX components Bootstrap by name.
 * 
 * @param {String[]} [names] One or more name.
 *
 * @returns {React.FC[]} The list of component classes / functions.
 */
window.vscodeKanban.getBootstrapComponents = function (...names) {
  const components = [];
  for (const name of names) {
    components.push(
      window.ReactBootstrap[name]
    );
  }

  return components;
};

/**
 * Gets the text class based on the color mode.
 *
 * @returns {String} The class name.
 */
window.vscodeKanban.getTextClass = function () {
  return `text-${this.colorMode === 'light' ? 'dark' : 'light'}`;
};

/**
 * Returns a list of JSX components by name.
 * 
 * @param {String[]} [names] One or more name.
 *
 * @returns {React.FC[]} The list of component classes / functions.
 */
window.vscodeKanban.getUIComponents = function (...names) {
  const components = [];
  for (const name of names) {
    components.push(
      window.vscodeKanban.ui.components[name]
    );
  }

  return components;
};

/**
 * Returns a list of JSX components by name.
 * 
 * @param {String} [name] The name.
 * @param {React.FC} [Component] The component class / function.
 */
window.vscodeKanban.setUIComponent = function (name, Component) {
  const MemorizedComponent = React.memo(Component);
  MemorizedComponent.displayName = name;

  window.vscodeKanban.ui.components[name] = MemorizedComponent;
};

// receive message from VSCode
window.addEventListener('message', async function (event) {
  const message = event.data;

  const { type, data } = message;

  switch (type) {
    case 'updateEnvironment':
      {
        const { i18n: i18nextOpts } = data;

        window.t = await i18next.init(i18nextOpts);

        window.dispatchEvent(
          new CustomEvent('onEnvironmentUpdated', {
            detail: data
          })
        );
      }
      break;

    case 'onBoardUpdated':
      {
        window.vscodeKanban.board = data;

        window.dispatchEvent(
          new CustomEvent(type, {
            detail: data
          })
        );
      }
      break;
  }
});
