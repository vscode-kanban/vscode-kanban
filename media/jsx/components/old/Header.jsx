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
    const [board, setBoard] = React.useState(null);
    const [icon, setIcon] = React.useState(null);
    const [projectName, setProjectName] = React.useState(null);

    const handleRefresh = React.useCallback(() => {
      postMsg('requestBoardUpdate');
    }, []);

    const handleSave = React.useCallback(() => {
      if (!board) {
        return;
      }

      postMsg('onBoardUpdated', board);
    }, [board]);

    const renderNavBrand = React.useCallback(() => {
      let title = 'Kanban Board';
      if (projectName?.length) {
        title += ` (${projectName})`;
      }

      if (icon?.length) {
        return (
          <React.Fragment>
            <img
              alt=""
              src={icon}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}{title}
          </React.Fragment>
        );
      } else {
        return title;
      }
    }, [icon, projectName]);

    React.useEffect(() => {
      const handleBoardUpdated = function(e) {
        setBoard(e.detail);
      };

      const handleEnvironmentUpdated = function(e) {
        setIcon(e.detail.icon);
        setProjectName(e.detail.projectName);
      };
  
      window.addEventListener("onEnvironmentUpdated", handleEnvironmentUpdated);
      window.addEventListener("onBoardUpdated", handleBoardUpdated);
  
      return () => {
        window.removeEventListener("onEnvironmentUpdated", handleEnvironmentUpdated);
        window.removeEventListener("onBoardUpdated", handleBoardUpdated);
      };
    }, []);

    return (
      <nav className={`navbar ${window.vscodeKanban.getBGClass()} header fixed-top`}>
        <div className="container-fluid">
          <a className={`navbar-brand text-white`} href="#">
            {renderNavBrand()}
          </a>
  
          <div className="d-flex justify-content-end">
            {/* filter */}
            <button type="button" className="btn btn-sm btn-primary ms-1" disabled={!board}>
              <i className="fa fa-filter"></i>
            </button>
            {/* refresh */}
            <button
              type="button" className="btn btn-sm btn-secondary ms-1"
              onClick={handleRefresh} disabled={!board}
            >
              <i className="fa fa-arrows-rotate"></i>
            </button>
            {/* save */}
            <button
              type="button" className="btn btn-sm btn-secondary ms-1"
              onClick={handleSave} disabled={!board}
            >
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
