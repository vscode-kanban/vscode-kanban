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
    IconButton,
    InputBase,
    Toolbar,
    Typography,
    useTheme,
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
    // pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
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
    filterCompilationError,
    onFilterChange
  }) => {
    const {
      VSCODE_KANBAN_FILTER_MODE_STRING_SEARCH: FILTER_MODE_STRING_SEARCH,
      VSCODE_KANBAN_FILTER_MODE_FILTER_EXPRESSION: FILTER_MODE_FILTER_EXPRESSION,
      t
    } = window;

    const [board, setBoard] = React.useState(null);
    const [filter, setFilter] = React.useState(initialFilter);
    const [filterMode, setFilterMode] = React.useState(FILTER_MODE_STRING_SEARCH);
    const [icon, setIcon] = React.useState(null);
    const [projectName, setProjectName] = React.useState(null);

    const theme = useTheme();

    const filterCompilationHasFailed = React.useMemo(() => {
      return !!filterCompilationError;
    }, [filterCompilationError]);

    const filterCompilationErrorMessage = React.useMemo(() => {
      return filterCompilationHasFailed ?
        String(filterCompilationError).trim() :
        '';
    }, [filterCompilationError, filterCompilationHasFailed]);

    const renderTitleBrand = React.useCallback(() => {
      let titleText = 'Kanban';
      if (projectName?.length) {
        titleText += ` (${projectName})`;
      }

      const title = (
        <Typography
          className="boardIcon"
          variant="h6" component="div" sx={{ flexGrow: 1 }}
          style={{
            marginLeft: theme.spacing(3)
          }}
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
              width={theme.spacing(4)}
              height={theme.spacing(4)}
            />{title}
          </React.Fragment>
        );
      } else {
        return title;
      }
    }, [icon, projectName, theme]);

    const renderFilterControl = React.useCallback(() => {
      let color;
      let title;
      if (filterCompilationErrorMessage.length) {
        color = theme.palette.error.main;
        title = filterCompilationErrorMessage;
      }

      const toggleFilterMode = () => {
        if (filterMode === FILTER_MODE_FILTER_EXPRESSION) {
          setFilterMode(FILTER_MODE_STRING_SEARCH);
        } else {
          setFilterMode(FILTER_MODE_FILTER_EXPRESSION);
        }
      };

      let icon;
      let placeholder;
      let iconTitle;
      if (filterMode === FILTER_MODE_STRING_SEARCH) {
        icon = (
          <span
            className="material-icons"
            onClick={toggleFilterMode}
          >search</span>
        );

        placeholder = t('search');
        iconTitle = t('toggle_filter_mode.switch_to_string_filter_expression');
      } else {
        icon = (
          <span
            className="material-icons"
            onClick={toggleFilterMode}
          >filter_list</span>
        );

        placeholder = t('filter_expression');
        iconTitle = t('toggle_filter_mode.switch_to_string_search');
      }

      return (
        <Search
          style={{
            marginRight: theme.spacing(4),
            color,
          }}
          title={title}
        >
          <SearchIconWrapper
            title={`${iconTitle} ...`}
            style={{
              cursor: 'pointer'
            }}
          >
            {icon}
          </SearchIconWrapper>

          <StyledInputBase
            placeholder={`${placeholder} ...`}
            onChange={(ev) => {
              setFilter(String(ev.target.value ?? ''));
            }}
            value={filter}
          />
        </Search>
      );
    }, [filter, filterCompilationErrorMessage, filterMode, t, theme]);

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
      onFilterChange({
        filter,
        filterMode
      });
    }, [filter, filterMode]);

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
            {renderFilterControl()}

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
