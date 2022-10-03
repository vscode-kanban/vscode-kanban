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
  window.vscodeKanban.setUIComponent('ConfirmDialog', ({
    body,
    onClose,
    show,
    title
  }) => {
    const { t } = window;

    const [Modal, Button] = window.vscodeKanban.getBootstrapComponents(
      'Modal', 'Button'
    );

    const handleClose = React.useCallback((button) => {
      onClose(button || null);
    }, [onClose]);

    return (
      show && (
        <Modal
          show
          onHide={handleClose}
          centered
          className="confirmDialog"
        >
          <Modal.Header
            className="bg-warning"
          >
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {body}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => { handleClose(false); }}
            >
              {t('no')}
            </Button>

            <Button
              variant="primary"
              onClick={() => { handleClose(true); }}
            >
              {t('yes')}
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  });  
})();
