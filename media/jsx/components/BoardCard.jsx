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
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography,
    useTheme
  } = MaterialUI;

  const {
    Draggable
  } = ReactBeautifulDnd;

  const {
    toPrettyTimeDiff
  } = window.vscodeKanban;

  window.vscodeKanban.setUIComponent('BoardCard', ({
    card,
    cardIndex,
    onClick,
    onEditClick,
  }) => {
    const [Markdown, Icon] = window.vscodeKanban.getUIComponents('Markdown', 'Icon');

    const { t } = window;
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState(null);

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

    const renderHeader = React.useCallback(() => {
      const assignedTo = String(card.assignedTo?.name ?? '').trim();
      const title = String(card.title ?? '').trim();

      const handleAvatarClick = () => {
        onClick('avatar', {
          card,
        });
      };

      const handleMenuClick = (ev) => {
        setAnchorEl(ev.currentTarget);
      };
      const handleMenuClose = () => {
        setAnchorEl(null);
      };

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

      let avatar;
      if (shortName.length) {
        avatar = (
          <Avatar
            style={{
              cursor: 'pointer',
            }}
            onClick={handleAvatarClick}
          >{shortName}</Avatar>
        );
      }

      let subheader = '';
      try {
        const creationTime = card.creation_time?.trim();
        if (creationTime?.length) {
          const time = dayjs(creationTime);
          if (time.isValid()) {
            subheader = toPrettyTimeDiff(time);
          }
        }
      } catch (error) { }

      return (
        <React.Fragment>
          <CardHeader
            avatar={avatar}
            action={
              <IconButton
                onClick={handleMenuClick}
              >
                <Icon>more_vert</Icon>
              </IconButton>
            }
            title={title}
            subheader={subheader}
          />

          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
              style: {
                maxHeight: theme.spacing(6) * 4.5,
                width: '20ch',
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem
              onClick={handleCardEditClick}
            >
              <ListItemIcon>
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText>{t('edit')}</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem>
              <ListItemIcon>
                <Icon>delete</Icon>
              </ListItemIcon>
              <ListItemText>{t('delete')}</ListItemText>
            </MenuItem>
          </Menu>
        </React.Fragment>
      );
    }, [anchorEl, card.assignedTo?.name, card.creation_time, card.title, handleCardEditClick, theme, t]);

    const renderDescription = React.useCallback(() => {
      const descriptionContent = String(card.description?.content ?? '').trim();
      if (descriptionContent.length) {
        return (
          <Box component="small" m={1}>
            <Typography
              variant="body2"
            >
              <Markdown source={descriptionContent} />
            </Typography>
          </Box>
        );
      } else {
        return null;
      }
    }, [card.description?.content, theme]);

    const renderInfo = React.useCallback(() => {
      const category = String(card.category ?? '').trim();
      const bgColor = theme.palette[cardColor].dark;
      const textColor = theme.palette[cardColor].contrastText;

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
                {renderHeader()}

                <CardContent>
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
              </Card>
            );
          }}
        </Draggable>
      </Grid>
    );
  });
})();
