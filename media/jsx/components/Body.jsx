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
  const {
    CircularProgress,
    Grid,
    useTheme
  } = MaterialUI;

  window.vscodeKanban.setUIComponent('Body', ({
    filter
  }) => {
    const { t } = window;

    const [BoardCardColumn] = window.vscodeKanban.getUIComponents('BoardCardColumn');

    const theme = useTheme();

    const [board, setBoard] = React.useState(null);

    const renderContent = React.useCallback(() => {
      if (board) {
        return (
          <Grid container className="cardColumns">
            <BoardCardColumn
              title={t('card_columns.todos')}
              headerColor={theme.palette.secondary.main} headerTextColor={theme.palette.secondary.contrastText}
              board={board} cardGroup={'todo'}
              buttons={[{
                icon: 'add_circle'
              }]}
              filter={filter}
            />

            <BoardCardColumn
              title={t('card_columns.in_progress')}
              headerColor={theme.palette.primary.main} headerTextColor={theme.palette.primary.contrastText}
              board={board} cardGroup={'in-progress'}
              filter={filter}
            />

            <BoardCardColumn
              title={t('card_columns.testing')}
              headerColor={theme.palette.warning.main} headerTextColor={theme.palette.warning.contrastText}
              board={board} cardGroup={'testing'}
              filter={filter}
            />

            <BoardCardColumn
              title={t('card_columns.done')}
              headerColor={theme.palette.success.main} headerTextColor={theme.palette.success.contrastText}
              board={board} cardGroup={'done'}
              buttons={[{
                icon: 'cleaning_services', iconClass: 'material-icons-outlined'
              }]}
              filter={filter}
              isLast
            />
          </Grid>
        );
      } else {
        return (
          <div className="boardProgress">
            <CircularProgress />
          </div>
        );
      }
    }, [board, filter, theme]);

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
      <div
        className="boardBody"
        style={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          height: `calc(100vh - ${theme.spacing(8)})`,
          padding: theme.spacing(2)
        }}
      >
        {renderContent()}
      </div>
    );
  });
})();
