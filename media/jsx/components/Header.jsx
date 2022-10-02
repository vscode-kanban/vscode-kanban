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

(() => {
  window.vscodeKanban.setUIComponent('Header', () => {
    return (
      <nav className={`navbar ${window.vscodeKanban.getBGClass()} header fixed-top`}>
        <div className="container-fluid">
          <a className={`navbar-brand text-white`} href="#">
            Kanban Board
          </a>
  
          <div className="d-flex justify-content-end">
            {/* filter */}
            <button type="button" className="btn btn-sm btn-primary ms-1">
              <i className="fa fa-filter"></i>
            </button>
            {/* refresh */}
            <button type="button" className="btn btn-sm btn-secondary ms-1">
              <i className="fa fa-arrows-rotate"></i>
            </button>
            {/* save */}
            <button type="button" className="btn btn-sm btn-secondary ms-1">
              <i className="fa fa-floppy-disk"></i>
            </button>
  
            {/* GitHub repository */}
            <button type="button" className="btn btn-sm btn-dark ms-4">
              <i className="fa-brands fa-github"></i>
            </button>
            {/* Author's homepage */}
            <button type="button" className="btn btn-sm btn-dark ms-1">
              <i className="fa fa-earth-europe"></i>
            </button>
          </div>
        </div>
      </nav>
    );
  });  
})();
