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

    const handleFilterUpdate = React.useCallback((newFilter) => {
      setFilter(newFilter);
    }, []);

    const filterPredicate = React.useMemo(() => {
      let predicate;
      if (filter.trimStart().toLowerCase().startsWith('f:')) {
        const semicolon = filter.indexOf(':');
        const filterExpr = filter.substring(semicolon + 1);

        try {
          const compiledPredicate = window.vscodeKanban.compileFilter(filterExpr);

          predicate = (card) => {
            const category = String(card.category ?? '');

            return !!compiledPredicate({
              assigned_to: String(card.assignedTo?.name ?? ''),
              cat: category,
              category,
              description: String(card.description?.content ?? ''),
              details: String(card.details?.content ?? ''),
              title: String(card.title ?? ''),
              type: String(card.type ?? ''),
            });
          };
        } catch (error) {
          console.warn(`window.vscodeKanban.compileFilter(${JSON.stringify(filterExpr)}) failed:`, error);

          predicate = false;
        }
      } else {
        const normalizedFilterParts = _(filter.split(' '))
          .map((part) => part.trim())
          .filter((part) => part !== '')
          .uniq()
          .take(10)
          .value();

        predicate = (card) => {
          const strValues = _([
            card.assignedTo?.name,
            card.category,
            card.title,
            card.description?.content,
            card.details?.content,
            card.title,
            card.type
          ]).map((value) => {
            return String(value ?? '').toLowerCase().trim();
          }).filter((str) => {
            return str !== '';
          }).value();

          return strValues.some((str) => {
            return normalizedFilterParts.every((part) => {
              return str.includes(part);
            });
          });
        };
      }

      if (typeof predicate !== 'function') {
        predicate = () => true;
      }

      return predicate;
    }, [filter]);

    React.useEffect(() => {
      // tell VSCode board has been rendered initially
      postMsg('onPageLoaded');
    }, []);

    return (
        <ThemeProvider theme={theme}>
          <Header
            filter={filter}
            onFilterChange={setFilter}
          />
          <Body
            filter={filter}
            filterPredicate={filterPredicate}
            onFilterUpdate={handleFilterUpdate}
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
