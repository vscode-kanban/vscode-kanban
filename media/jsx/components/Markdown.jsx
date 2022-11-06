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
  window.vscodeKanban.setUIComponent('Markdown', ({
    element = 'span',
    source,
  }) => {
    const elRef = React.useRef(null);

    const html = React.useMemo(() => {
      const converter = new showdown.Converter();

      return converter.makeHtml(String(source ?? ''));
    }, [source]);

    const renderContent = React.useCallback(() => {
      return React.createElement(element, {
        ref: elRef,
        dangerouslySetInnerHTML: {
          __html: html
        },
      });
    }, [element, html, elRef]);

    React.useEffect(() => {
      elRef.current?.querySelectorAll('pre code').forEach((childEl) => {
        hljs.highlightElement(childEl);
      });
    }, [elRef.current]);

    return renderContent();
  });
})();
