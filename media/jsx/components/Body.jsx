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
  window.vscodeKanban.setUIComponent('Body', () => {
    const [BoardCardColumn] = window.vscodeKanban.getUIComponents('BoardCardColumn');
    const [Spinner] = window.vscodeKanban.getBootstrapComponents('Spinner');

    const [board, setBoard] = React.useState(null);
  
    const handleBoardUpdate = React.useCallback(async ({ board: newBoard }) => {
      await postMsg('onBoardUpdated', newBoard);

      setBoard(newBoard);
      window.vscodeKanban.board = newBoard;
    }, []);
  
    const renderContent = React.useCallback(() => {
      if (board) {
        return (
          <div
            className="row h-100 cardColumns"
          >
            <BoardCardColumn
              title="Todo" headerColor="light"
              board={board} cardGroup={'todo'}
              onBoardUpdate={handleBoardUpdate}
            />
        
            <BoardCardColumn
              title="In Progress" headerColor="primary"
              board={board} cardGroup={'in-progress'}
              onBoardUpdate={handleBoardUpdate}
            />
  
            <BoardCardColumn
              title="Testing" headerColor="warning"
              board={board} cardGroup={'testing'}
              onBoardUpdate={handleBoardUpdate}
            />
  
            <BoardCardColumn
              title="Done" headerColor="success"
              board={board} cardGroup={'done'}
              onBoardUpdate={handleBoardUpdate}
            />
          </div>
        );
      } else {
        return (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        );
      }
    }, [board]);
  
    React.useEffect(() => {
      const handleBoardUpdated = function(e) {
        setBoard(e.detail);
      };
  
      window.addEventListener("onBoardUpdated", handleBoardUpdated);
  
      return () => {
        window.removeEventListener("onBoardUpdated", handleBoardUpdated);
      };
    }, []);
  
    return (
      <main
        className="container-fluid boardBody"
        style={{ backgroundColor: 'white' }}
      >
        {renderContent()}
      </main>
    );
  });  
})();
