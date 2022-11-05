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
    },
  }));

  window.vscodeKanban.setUIComponent('Header', () => {
    const { t } = window;

    const [board, setBoard] = React.useState(null);
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
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}{title}
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
                marginRight: theme.spacing(2),
              }}
            >
              <SearchIconWrapper>
                <span class="material-icons">search</span>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={`${t('filter')} ...`}
              />
            </Search>

            {/* refresh */}
            <IconButton
                color="secondary" size="small"
            >
              <i className="fa fa-arrows-rotate"></i>
            </IconButton>
            {/* save */}
            <IconButton
              color="secondary" size="small"
              style={{
                marginRight: theme.spacing(1)
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
