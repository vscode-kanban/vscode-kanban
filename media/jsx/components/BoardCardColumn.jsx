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
  window.vscodeKanban.setUIComponent('BoardCardColumn', ({
    board,
    cardGroup,
    headerColor,
    onBoardUpdate,
    title
  }) => {
    const [BoardCard, BoardCardDialog] = window.vscodeKanban.getUIComponents('BoardCard', 'BoardCardDialog');
    const [Card] = window.vscodeKanban.getBootstrapComponents('Card');

    const [cardToEdit, setCardToEdit] = React.useState(null);
  
    // sorted list of cards
    const cards = React.useMemo(() => {
      return _(board[cardGroup])
        .sortBy((item) => {
          const type = String(item.type || '').toLowerCase().trim();
          if (['emergency'].includes(type)) {
            return Number.MIN_SAFE_INTEGER;
          } else if (['bug'].includes(type)) {
            return Number.MIN_SAFE_INTEGER + 1;
          }
  
          return Number.MAX_SAFE_INTEGER;
        })
        .value();
    }, [board, cardGroup]);
  
    const handleCardDrop = React.useCallback((ev) => {
      ev.preventDefault();
  
      // find card by ID
      const cardId = ev.dataTransfer.getData("text");
      const matchingCards = Object.values(board)
        .flat()
        .filter((item) => item.id === cardId);
  
      // create a new board
      // without the card in the first step
      const newBoard = {};
      for (const [group, items] of Object.entries(board)) {
        newBoard[group] = items.filter((item) => item.id !== cardId);
      }
  
      // now add card to this column
      newBoard[cardGroup].push(...matchingCards);
  
      onBoardUpdate({
        group: cardGroup,
        board: newBoard
      });
    }, [board, cardGroup, onBoardUpdate]);
  
    const handleCardEdit = React.useCallback((card) => {
      setCardToEdit(card);
    }, []);
  
    const handleCardDelete = React.useCallback((card) => {
    }, []);
  
    const renderDialog = React.useCallback(() => {
      if (cardToEdit) {
        const handleOnClose = () => {
          setCardToEdit(null);
        };
  
        return (
          <BoardCardDialog
            mode="edit"
            board={board}
            card={cardToEdit}
            show
            onClose={handleOnClose}
          />
        );
      }
  
      return null;
    }, [board, cardToEdit]);
  
    return (
      <React.Fragment>
        <div
          className="col h-100 text-black cardColumn"
        >
          <div
            className="h-100 text-black cardList"
          >
            <Card
              className="mw-100 h-100"
            >
              <Card.Header
                className={`text-bg-${headerColor}`}
              >
                {title}
              </Card.Header>
  
              <Card.Body
                className="card-body text-bg-light h-100"
                onDragOver={(ev) => { ev.preventDefault(); }}
                onDrop={handleCardDrop}
              >
                {cards.map((card, cardIndex) => {
                  return (
                    <BoardCard
                      key={`boardcard-${card.id}-${cardIndex}`}
                      card={card}
                      onEditClick={() => { handleCardEdit(card); }}
                      onDeleteClick={() => { handleCardDelete(card); }}
                    />
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        </div>
  
        {renderDialog()}
      </React.Fragment>
    );
  });
})();
