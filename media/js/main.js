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
