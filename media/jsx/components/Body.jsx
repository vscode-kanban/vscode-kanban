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

window.vscodeKanban.setUIComponent('Body', () => {
  const [ CardColumn ] = window.vscodeKanban.getUIComponents('CardColumn');

  // const [now, setNow] = React.useState("");

  React.useEffect(() => {
      // setNow(new Date().toISOString());
  }, []);

  return (
    <main
      className="container-fluid boardBody"
      style={{ backgroundColor: 'white' }}
    >
      <div
        className="row h-100 cardColumns"
      >
        <CardColumn title="Todo" headerColor="secondary" />
    
        <CardColumn title="In Progress" headerColor="primary" />

        <CardColumn title="Testing" headerColor="warning" />

        <CardColumn title="Done" headerColor="success" />
      </div>
    </main>
  );
});
