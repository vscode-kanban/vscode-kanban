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
    const {
      VSCODE_KANBAN_FILTER_MODE_STRING_SEARCH: FILTER_MODE_STRING_SEARCH,
      VSCODE_KANBAN_FILTER_MODE_FILTER_EXPRESSION: FILTER_MODE_FILTER_EXPRESSION,
    } = window;

    const [Header, Body] = window.vscodeKanban.getUIComponents('Header', 'Body');

    const [colorMode, setColorMode] = React.useState(window.vscodeKanban.colorMode);
    const [filter, setFilter] = React.useState('');
    const [filterMode, setFilterMode] = React.useState(FILTER_MODE_STRING_SEARCH);

    const theme = React.useMemo(() => {
      return createTheme({
        palette: {
          mode: colorMode === 'dark' ? 'dark' : 'light',
        },
      });
    }, [colorMode]);

    const handleFilterChange = React.useCallback(({
      filter: newFilter,
      filterMode: newFilterMode,
    }) => {
      setFilter(newFilter);
      setFilterMode(newFilterMode);
    }, []);

    const handleFilterUpdate = React.useCallback((newFilter) => {
      setFilter(newFilter);
    }, []);

    const {
      error: filterCompilationError,
      predicate: filterPredicate,
    } = React.useMemo(() => {
      let predicate;
      let error;

      if (filterMode === FILTER_MODE_FILTER_EXPRESSION) {
        const now = dayjs();
        const semicolon = filter.indexOf(':');
        const filterExpr = filter.substring(semicolon + 1);

        try {
          const compiledPredicate = window.vscodeKanban.compileFilter(filterExpr);

          predicate = (card) => {
            const category = String(card.category ?? '');
            const type = String(card.type ?? '').toLowerCase().trim();

            let priority = parseFloat(String(card.prio ?? '0').trim());
            if (isNaN(priority)) {
              priority = null;
            }

            let time = String(card.creation_time ?? '').trim();
            if (time.length) {
              try {
                time = dayjs.utc(time);
                if (!time.isValid()) {
                  time = null;
                }
              } catch (error) {
                time = null;
              }
            } else {
              time = null;
            }

            const isBug = ['bug', 'issue'].includes(type);
            const isNote = ['', 'note', 'task'].includes(type);
            const isEmergency = ['emergency'].includes(type);

            return !!compiledPredicate({
              assigned_to: String(card.assignedTo?.name ?? ''),
              cat: category,
              category,
              description: String(card.description?.content ?? ''),
              details: String(card.details?.content ?? ''),
              id: String(card.id ?? ''),
              is_bug: isBug,
              is_emerg: isEmergency,
              is_emergency: isEmergency,
              is_issue: isBug,
              is_note: isNote,
              is_task: isNote,
              no: false,
              now: now.valueOf(),
              prio: priority,
              priority,
              tag: card.tag,
              time: time ? time.valueOf() : null,
              title: String(card.title ?? ''),
              type,
              utc: now.utc().valueOf(),
              yes: true,
            });
          };
        } catch (ex) {
          error = ex;
          predicate = false;
        }
      } else {
        const normalizedFilterParts = _(filter.split(' '))
          .map((part) => part.toLowerCase().trim())
          .filter((part) => part !== '')
          .uniq()
          .take(10)
          .value();

        if (normalizedFilterParts.length) {
          predicate = (card) => {
            const strValues = _([
              card.assignedTo?.name,
              card.category,
              card.title,
              card.description?.content,
              card.details?.content,
              card.id,
              card.type
            ]).map((value) => {
              return String(value ?? '').toLowerCase().trim();
            }).filter((str) => {
              return str !== '';
            }).value();

            return normalizedFilterParts.every((part) => {
              return strValues.some((str) => {
                return str.includes(part);
              });
            });
          };
        }
      }

      if (typeof predicate !== 'function') {
        // fallback
        predicate = () => true;
      }

      return {
        error,
        predicate
      };
    }, [filter, filterMode]);

    React.useEffect(() => {
      // tell VSCode board has been rendered initially
      postMsg('onPageLoaded');
    }, []);

    return (
        <ThemeProvider theme={theme}>
          <Header
            filter={filter}
            filterCompilationError={filterCompilationError}
            onFilterChange={handleFilterChange}
          />
          <Body
            filter={filter}
            filterMode={filterMode}
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
