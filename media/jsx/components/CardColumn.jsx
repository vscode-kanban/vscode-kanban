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

window.vscodeKanban.setUIComponent('CardColumn', (props) => {
  const { headerColor, title } = props;

  // const [now, setNow] = React.useState("");

  React.useEffect(() => {
      // setNow(new Date().toISOString());
  }, []);

  return (
    <div
      className="col h-100 text-black cardColumn"
    >
      <div
        className="h-100 text-black cardList"
      >
        <div className="card mw-100 h-100">
          <div className={`card-header text-bg-${headerColor}`}>{title}</div>

          <div className="card-body text-bg-light h-100">
            mkmk
          </div>
        </div>
      </div>
    </div>
  );
});
