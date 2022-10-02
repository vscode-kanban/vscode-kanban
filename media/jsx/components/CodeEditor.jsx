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
  window.vscodeKanban.setUIComponent('CodeEditor', ({
    onChange,
    value: initialValue
  }) => {
    const el = React.useRef(null);

    const [value, setValue] = React.useState('');

    React.useEffect(() => {
      onChange(value);
    }, [value]);

    React.useEffect(() => {
      const editor = window.CodeMirror.fromTextArea(el.current, {
        lineNumbers: true,
        tabSize: 2,
        value: initialValue,
        mode: 'markdown'
      });

      editor.on('change', (cm) => {
        setValue(String(cm.getValue() || ''));
      });

      editor.setSize("100%", 128);

      setValue(initialValue);

      return () => {
        editor.toTextArea();
      };
    }, []);

    return (
      <textarea ref={el} />
    );
  });
})();
