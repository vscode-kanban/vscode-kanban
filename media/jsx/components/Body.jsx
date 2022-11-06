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

  const {
    DragDropContext
  } = ReactBeautifulDnd;

  window.vscodeKanban.setUIComponent('Body', ({
    filter,
    filterMode,
    filterPredicate,
    onFilterUpdate
  }) => {
    const {
      VSCODE_KANBAN_FILTER_MODE_FILTER_EXPRESSION: FILTER_MODE_FILTER_EXPRESSION,
    } = window;

    const { t } = window;

    const [BoardCardColumn] = window.vscodeKanban.getUIComponents('BoardCardColumn');

    const theme = useTheme();

    const [board, setBoard] = React.useState(null);

    const handleBoardUpdate = React.useCallback(async ({ board: newBoard }) => {
      await postMsg('onBoardUpdated', newBoard);

      window.vscodeKanban.board = newBoard;
      setBoard(newBoard);
    }, []);

    const handleDragEnd = React.useCallback((...args) => {
      const ev = args[0];

      const { destination, draggableId, source } = ev;
      const { droppableId: droppableDestinationId } = destination;
      const { droppableId: droppableSourceId } = source;

      const draggableIdParts = draggableId.split('_');
      const droppableDestinationIdParts = droppableDestinationId.split('_');
      const droppableSourceIdParts = droppableSourceId.split('_');

      const globalCardIndex = Number(_(draggableIdParts).last());
      const sourceCardGroup = _(droppableSourceIdParts).last();
      const destinationCardGroup = _(droppableDestinationIdParts).last();

      if (sourceCardGroup === destinationCardGroup) {
        return;
      }

      const allCards = window.vscodeKanban.getAllCards(board);
      const matchingCard = allCards[globalCardIndex];
      if (!matchingCard) {
        return;
      }

      // create a new board
      // without the card in the first step
      const newBoard = {};
      for (const [group, items] of Object.entries(board)) {
        newBoard[group] = [...items];
      }

      let sourceCards = newBoard[sourceCardGroup];
      if (Array.isArray(sourceCards)) {
        newBoard[sourceCardGroup] = sourceCards = sourceCards.filter((item) => {
          return item.id !== matchingCard.id;
        });
      }

      const destinationCards = newBoard[destinationCardGroup];
      if (Array.isArray(destinationCards)) {
        // now add card to this column
        destinationCards.push(matchingCard);
      }
  
      handleBoardUpdate({ board: newBoard });
    }, [board, handleBoardUpdate]);

    const handleCardClick = React.useCallback((cardGroup, type, data) => {
      let newFilter = String(filter ?? '');
      const normalizedFilter = newFilter.toLowerCase().trim();
      const isAlreadyFilterExpr = filterMode === FILTER_MODE_FILTER_EXPRESSION;

      const addFilterExpr = (expr) => {
        if (normalizedFilter.length) {
          newFilter = `${newFilter} and ${expr}`;
        } else {
          newFilter = `${expr}`;
        }
      };

      const addRawExpr = (expr) => {
        const normalizedExpr = expr.toLowerCase().trim();
        const normalizedExprParts = _(normalizedExpr)
          .split(' ')
          .map((part) => part.trim())
          .filter((part) => part !== '')
          .uniq()
          .value();

        if (normalizedFilter.length) {
          normalizedExprParts.forEach((part) => {
            if (!normalizedFilter.includes(part)) {
              newFilter = `${newFilter.trim()} ${part}`;
            }
          });
        } else {
          newFilter = normalizedExpr;
        }
      };

      if (type === 'avatar') {
        const assignedTo = String(data.card.assignedTo?.name ?? '');

        if (isAlreadyFilterExpr) {
          addFilterExpr(`trim(lower(assigned_to)) == ${JSON.stringify(
            assignedTo.toLowerCase().trim()
          )}`);
        } else {
          addRawExpr(assignedTo);
        }
      } else if (type === 'category') {
        const category = String(data.card.category ?? '');

        if (isAlreadyFilterExpr) {
          addFilterExpr(`trim(lower(category)) == ${JSON.stringify(
            category.toLowerCase().trim()
          )}`);
        } else {
          addRawExpr(category);
        }
      }

      onFilterUpdate(newFilter);
    }, [filter, filterMode, onFilterUpdate]);

    const renderContent = React.useCallback(() => {
      if (board) {
        return (
          <Grid container className="cardColumns">
            <DragDropContext
              onDragEnd={handleDragEnd}
            >
              <BoardCardColumn
                title={t('card_columns.todos')}
                headerColor={theme.palette.secondary.main} headerTextColor={theme.palette.secondary.contrastText}
                board={board} cardGroup={'todo'}
                buttons={[{
                  icon: 'add_circle'
                }]}
                cardFilter={filterPredicate}
                onBoardUpdate={handleBoardUpdate}
                onCardClick={handleCardClick}
              />

              <BoardCardColumn
                title={t('card_columns.in_progress')}
                headerColor={theme.palette.primary.main} headerTextColor={theme.palette.primary.contrastText}
                board={board} cardGroup={'in-progress'}
                cardFilter={filterPredicate}
                onBoardUpdate={handleBoardUpdate}
                onCardClick={handleCardClick}
              />

              <BoardCardColumn
                title={t('card_columns.testing')}
                headerColor={theme.palette.warning.main} headerTextColor={theme.palette.warning.contrastText}
                board={board} cardGroup={'testing'}
                cardFilter={filterPredicate}
                onBoardUpdate={handleBoardUpdate}
                onCardClick={handleCardClick}
              />

              <BoardCardColumn
                title={t('card_columns.done')}
                headerColor={theme.palette.success.main} headerTextColor={theme.palette.success.contrastText}
                board={board} cardGroup={'done'}
                buttons={[{
                  icon: 'cleaning_services', iconClass: 'material-icons-outlined'
                }]}
                cardFilter={filterPredicate}
                onBoardUpdate={handleBoardUpdate}
                onCardClick={handleCardClick}
                isLast
              />
            </DragDropContext>
          </Grid>
        );
      } else {
        return (
          <div className="boardProgress">
            <CircularProgress />
          </div>
        );
      }
    }, [board, filter, filterPredicate, handleCardClick, theme]);

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
