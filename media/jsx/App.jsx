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
    CssBaseline,
    ThemeProvider,
    createTheme,
  } = MaterialUI;  

  const App = () => {
    const [Header, Body] = window.vscodeKanban.getUIComponents('Header', 'Body');

    const [colorMode, setColorMode] = React.useState(window.vscodeKanban.colorMode);
    const [filter, setFilter] = React.useState('');

    const theme = React.useMemo(() => {
      return createTheme({
        palette: {
          mode: colorMode === 'dark' ? 'dark' : 'light',
        },
      });
    }, [colorMode]);

    React.useEffect(() => {
      // tell VSCode board has been rendered initially
      postMsg('onPageLoaded');
    }, []);

    return (
        <ThemeProvider theme={theme}>
          <Header
            onFilterChange={setFilter}
          />
          <Body
            filter={filter}
          />
        </ThemeProvider>
    );
  };

  ReactDOM.render(
    (
      <React.Fragment>
        <CssBaseline />
        <App />
      </React.Fragment>
    ),
    document.querySelector("#vscode-kanban-board")
  );
})();
