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
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    Chip,
    Grid,
    IconButton,
    Typography,
    useTheme
  } = MaterialUI;

  const {
    Draggable
  } = ReactBeautifulDnd;

  window.vscodeKanban.setUIComponent('BoardCard', ({
    card,
    cardIndex,
    onClick,
    onEditClick,
  }) => {
    const [Markdown] = window.vscodeKanban.getUIComponents('Markdown');

    const theme = useTheme();

    const cardColor = React.useMemo(() => {
      const type = String(card.type).toLowerCase().trim();

      if (['bug'].includes(type)) {
        return 'warning';
      } else if (['emergency'].includes(type)) {
        return 'error';
      } else {
        return 'info';
      }
    }, [card.type, theme]);

    const handleCardEditClick = React.useCallback(() => {
      onEditClick(card);
    }, [card, onEditClick]);

    const renderTitle = React.useCallback(() => {
      const title = String(card.title ?? '').trim();

      if (title.length) {
        return (
          <Typography component="h5" variant="h6">
            {title}
          </Typography>
        );
      } else {
        return null;
      }
    }, [card.title]);

    const renderDescription = React.useCallback(() => {
      const descriptionContent = String(card.description?.content ?? '').trim();

      return (
        <Box component="small" m={1}>
          <Typography
            variant="body2"
          >
            <Markdown source={descriptionContent} />
          </Typography>
        </Box>
      );
    }, [card.description?.content, theme]);

    const renderInfo = React.useCallback(() => {
      const assignedTo = String(card.assignedTo?.name ?? '').trim();
      const category = String(card.category ?? '').trim();
      const bgColor = theme.palette[cardColor].dark;
      const textColor = theme.palette[cardColor].contrastText;
      const avatarSize = theme.spacing(4);
      const avatarTextSize = theme.spacing(2);

      let shortName = '';
      if (assignedTo.length) {
        const assignedToParts = assignedTo.split(' ').filter((part) => {
          return part.trim();
        }).filter((part) => {
          return part !== '';
        });

        if (assignedToParts.length) {
          shortName += _(assignedToParts).first()[0]?.toUpperCase();

          if (assignedToParts.length > 1) {
            shortName += _(assignedToParts).last()[0]?.toUpperCase();
          }
        }
      }

      const handleAvatarClick = () => {
        onClick('avatar', {
          card,
        });
      };

      const handleCategoryClick = () => {
        onClick('category', {
          card,
        });
      };

      return (
        <React.Fragment>
          {category.length ? (
            <Chip
              label={category}
              size="small"
              onClick={handleCategoryClick}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                cursor: 'pointer',
              }}
            />
          ) : (
            <span>&nbsp;</span>
          )}

          {!!shortName.length && (
            <Avatar
              alt={assignedTo}
              title={assignedTo}
              sx={{ width: avatarSize, height: avatarSize }}
              style={{
                fontSize: avatarTextSize,
                cursor: 'pointer',
              }}
              onClick={handleAvatarClick}
            >{shortName}</Avatar>
          )}
        </React.Fragment>
      );
    }, [card.assignedTo?.name, card.category, cardColor, onClick, theme]); 

    return (
      <Grid
        item xs={12} className="boardCard"
        style={{
          paddingBottom: theme.spacing(2)
        }}
        // onClick={handleCardClick}
      >
        <Draggable draggableId={`draggable_card_${cardIndex}`} index={cardIndex}>
          {(provided, snapshot) => {
            const additionalProps = {
              ...provided.draggableProps,
              ...provided.dragHandleProps,
            };

            if (!additionalProps.style) {
              additionalProps.style = {};
            }
            additionalProps.style['borderLeft'] = `${theme.spacing(0.75)} solid ${theme.palette[cardColor].dark}`;

            return (
              <Card
                ref={provided.innerRef}
                {...additionalProps}
              >
                <CardContent>
                  <Grid item xs={12}>
                    {renderTitle()}
                  </Grid>
    
                  <Grid item xs={12}>
                    {renderDescription()}
                  </Grid>
    
                  <Grid
                    item xs={12}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: theme.spacing(1)
                    }}
                  >
                    {renderInfo()}
                  </Grid>
                </CardContent>

                <CardActions disableSpacing>
                  <Box
                    sx={{ flexGrow: 1 }}
                  />

                  <IconButton
                    color="inherit" size="small"
                    onClick={handleCardEditClick}
                  >
                    <i className="material-icons">edit</i>
                  </IconButton>
                </CardActions>
              </Card>
            );
          }}
        </Draggable>
      </Grid>
    );
  });
})();
