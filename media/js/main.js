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
  ui: {
    components: {}
  }
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
window.addEventListener('message', function (event) {
  const message = event.data;

  const { type, data } = message;

  switch (type) {
    case 'onBoardUpdated':
      window.dispatchEvent(
        new CustomEvent(type, {
          detail: data
        })
      );
      break;
  }
});

// page has been loaded
document.addEventListener('DOMContentLoaded', function () {
  postMsg('onPageLoaded');
}, false);
