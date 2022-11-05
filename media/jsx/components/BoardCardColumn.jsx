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

  window.vscodeKanban.setUIComponent('BoardCardColumn', ({
    board,
    buttons,
    cardGroup,
    headerColor,
    headerTextColor,
    isLast,
    title
  }) => {
    const [BoardCard] = window.vscodeKanban.getUIComponents('BoardCard');

    const theme = useTheme();

    // sorted list of cards
    const cards = React.useMemo(() => {
      return _(board[cardGroup])
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
    }, [board, cardGroup]);

    const renderCards = React.useCallback(() => {
      return cards.map((card, cardIndex) => {
        return (
          <BoardCard
            key={`boardCard-${cardGroup}-${cardIndex}-${card.id}`}
            card={card}
          />
        );
      });
    }, [cardGroup, cards]);

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

          <CardContent
            style={{
              height: `calc(100vh - ${theme.spacing(12 + 15)})`,
              overflowY: 'auto'
            }}
          >
            {renderCards()}
          </CardContent>

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
