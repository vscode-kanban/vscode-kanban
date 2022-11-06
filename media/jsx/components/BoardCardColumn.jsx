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
    Box,
    Card,
    CardContent,
    Grid,
    CardHeader,
    IconButton,
    CardActions,
    useTheme
  } = MaterialUI;

  const {
    Droppable
  } = ReactBeautifulDnd;

  window.vscodeKanban.setUIComponent('BoardCardColumn', ({
    board,
    buttons,
    cardFilter,
    cardGroup,
    headerColor,
    headerTextColor,
    isLast,
    onCardClick,
    title
  }) => {
    const [BoardCard] = window.vscodeKanban.getUIComponents('BoardCard');

    const theme = useTheme();

    // sorted list of cards
    const cards = React.useMemo(() => {
      return _(board[cardGroup])
        .filter(cardFilter)
        .sortBy((item) => {
          // first sort by prio (DESC)
          return (isNaN(item.prio) ? 0 : item.prio) * -1;
        }, (item) => {
          // then by type

          const type = String(item.type || '').toLowerCase().trim();
          if (['emergency'].includes(type)) {
            return Number.MIN_SAFE_INTEGER;
          } else if (['bug'].includes(type)) {
            return Number.MIN_SAFE_INTEGER + 1;
          }
  
          return Number.MAX_SAFE_INTEGER;
        }, (item) => {
          // then by title (case-insensitive)
          return String(item.title || '').toLowerCase().trim();
        })
        .value();
    }, [board, cardFilter, cardGroup]);

    const handleCardClick = React.useCallback((...args) => {
      onCardClick(cardGroup, ...args);
    }, [cardGroup, onCardClick]);

    const renderCards = React.useCallback(() => {
      const allCards = window.vscodeKanban.getAllCards(board);

      return cards.map((card, cardIndex) => {
        const globalCardIndex = allCards.findIndex((globalCard) => {
          return globalCard === card;
        });

        return (
          <BoardCard
            key={`boardCard-${cardGroup}-${globalCardIndex}-${cardIndex}-${card.id}`}
            card={card}
            cardId={`boardCard-${cardGroup}-${globalCardIndex}-${cardIndex}-${card.id}`}
            cardIndex={globalCardIndex}
            onClick={handleCardClick}
          />
        );
      });
    }, [board, cardGroup, cards, handleCardClick]);

    const renderButtons = React.useCallback(() => {
      return buttons?.map((button, buttonIndex) => {
        const { icon, iconClass } = button;

        return (
          <IconButton
            key={`cardColumnButton-${buttonIndex}`}
          >
            <span
              class={iconClass || 'material-icons'}
            >{icon}</span>
          </IconButton>
        );
      });
    }, [buttons]);

    return (
      <Grid
        item xs={3} className="cardColumn"
        style={{
          height: `calc(100vh - ${theme.spacing(12)})`,
          paddingRight: theme.spacing(isLast ? 0 : 2)
        }}
      >
        <Card
          className="cardColumnCard"
          variant="outlined"
          style={{
            height: `calc(100vh - ${theme.spacing(12)})`,
          }}
        >
          <CardHeader
            title={title}
            style={{
              backgroundColor: headerColor,
              color: headerTextColor
            }}
          />

          <Droppable droppableId={`cardColumn_droppable_${cardGroup}`}>
            {(provided, snapshot) => {
              return (
                <CardContent
                  style={{
                    height: `calc(100vh - ${theme.spacing(12 + 15)})`,
                    overflowY: 'auto'
                  }}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  {renderCards()}
                  {provided.placeholder}
                </CardContent>
              );
            }}
          </Droppable>

          <CardActions disableSpacing>
            <Box
              sx={{ flexGrow: 1 }}
            />

            {renderButtons()}
          </CardActions>
        </Card>
      </Grid>
    );
  });
})();
