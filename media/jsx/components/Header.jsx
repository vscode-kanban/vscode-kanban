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
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useTheme,
    InputBase,
    alpha,
    styled
  } = MaterialUI;

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
      [theme.breakpoints.up('md')]: {
        width: '24ch',
        '&:focus': {
          width: '40ch',
        },
      },
      [theme.breakpoints.up('lg')]: {
        width: '36ch',
        '&:focus': {
          width: '60ch',
        },
      },
    },
  }));

  window.vscodeKanban.setUIComponent('Header', ({
    filter: initialFilter = '',
    onFilterChange
  }) => {
    const { t } = window;

    const [board, setBoard] = React.useState(null);
    const [filter, setFilter] = React.useState(initialFilter);
    const [icon, setIcon] = React.useState(null);
    const [projectName, setProjectName] = React.useState(null);

    const theme = useTheme();

    const renderTitleBrand = React.useCallback(() => {
      let titleText = 'Kanban';
      if (projectName?.length) {
        titleText += ` (${projectName})`;
      }

      const title = (
        <Typography
          className="boardIcon"
          variant="h6" component="div" sx={{ flexGrow: 1 }}
        >
          {titleText}
        </Typography>
      );

      if (icon?.length) {
        return (
          <React.Fragment>
            <img
              alt=""
              src={icon}
              width="32"
              height="32"
            />{title}
          </React.Fragment>
        );
      } else {
        return title;
      }
    }, [icon, projectName]);

    React.useEffect(() => {
      const handleBoardUpdated = function(e) {
        setBoard(e.detail);
      };

      const handleEnvironmentUpdated = function(e) {
        setIcon(e.detail.icon);
        setProjectName(e.detail.projectName);
      };
  
      window.addEventListener("onEnvironmentUpdated", handleEnvironmentUpdated);
      window.addEventListener("onBoardUpdated", handleBoardUpdated);
  
      return () => {
        window.removeEventListener("onEnvironmentUpdated", handleEnvironmentUpdated);
        window.removeEventListener("onBoardUpdated", handleBoardUpdated);
      };
    }, []);

    React.useEffect(() => {
      onFilterChange(filter);
    }, [filter]);

    React.useEffect(() => {
      setFilter(initialFilter);
    }, [initialFilter]);

    return (
      <Box
        className="boardHeader"
        sx={{ flexGrow: 1 }}
      >
        <AppBar position="static">
          <Toolbar>
            {renderTitleBrand()}

            {/* filter */}
            <Search
              style={{
                marginRight: theme.spacing(4),
              }}
            >
              <SearchIconWrapper>
                <span class="material-icons">filter_list</span>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={`${t('filter')} ...`}
                onChange={(ev) => {
                  setFilter(String(ev.target.value || ''));
                }}
                autoFocus
                value={filter}
              />
            </Search>

            {/* refresh */}
            <IconButton
              color="inherit" size="small"
            >
              <i className="fa fa-arrows-rotate"></i>
            </IconButton>
            {/* save */}
            <IconButton
              color="inherit" size="small"
              style={{
                marginRight: theme.spacing(2)
              }}
            >
              <i className="fa fa-floppy-disk"></i>
            </IconButton>
            
            {/* GitHub */}
            <IconButton
              color="inherit" size="small"
            >
              <i className="fa-brands fa-github"></i>
            </IconButton>
            {/* Author's homepage */}
            <IconButton
              color="inherit" size="small"
            >
              <i className="fa fa-earth-europe"></i>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    );
  });
})();
