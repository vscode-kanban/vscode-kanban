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
  window.vscodeKanban.setUIComponent('BoardCardDialog', ({
    card,
    mode,
    onClose,
    show
  }) => {
    const [Modal, Button, Form, Row, Col] = window.vscodeKanban.getBootstrapComponents(
      'Modal', 'Button', 'Form', 'Row', 'Col'
    );

    const [assignedTo, setAssignedTo] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [type, setType] = React.useState('');

    const handleClose = React.useCallback(() => {
      onClose();
    }, [onClose]);

    const headerClasses = React.useMemo(() => {  
      const classes = [];
      if (['bug'].includes(type)) {
        classes.push('bg-dark', 'text-light');
      } else if (['emergency'].includes(type)) {
        classes.push('bg-danger', 'text-light');
      } else {
        classes.push('bg-info', 'text-dark');
      }
  
      return classes;
    }, [type]);

    const renderTitle = React.useCallback(() => {
      if (mode === 'edit') {
        return `Edit card '${title}'`;
      }
    }, [mode, title]);

    React.useEffect(() => {
      if (mode === 'edit') {
        setTitle(String(card.title || ''));
        setType(String(card.type || '').toLowerCase().trim());
        setCategory(String(card.category || ''));
        setAssignedTo(String(card.assignedTo?.name || ''));
      }
    }, []);
  
    return (
      show && (
        <Modal
          show
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header
            closeButton
            className={headerClasses.join(' ')}
          >
            <Modal.Title>{renderTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* title */}
              <Row className="mb-3">
                <Col>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(ev) => { setTitle(ev.target.value); }}
                  />
                </Col>
              </Row>

              {/* type + prio */}
              <Row className="mb-3">
                <Col xs={8}>
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(ev) => { setType(ev.target.value); }}
                  >
                    <option value="">Note / task</option>
                    <option value="bug">Bug / issue</option>
                    <option value="emergency">Emergency</option>
                  </Form.Select>
                </Col>

                <Col>
                <Form.Label>Prio</Form.Label>
                  <Form.Control type="number" placeholder="0" />
                </Col>
              </Row>

              {/* category */}
              <Row className="mb-3">
                <Col>
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={category}
                    onChange={(ev) => { setCategory(ev.target.value); }}
                  />
                </Col>
              </Row>

              {/* assigned to */}
              <Row className="mb-3">
                <Col>
                  <Form.Label>Assigned To</Form.Label>
                  <Form.Control
                    type="text"
                    value={assignedTo}
                    onChange={(ev) => { setAssignedTo(ev.target.value); }}
                  />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  });  
})();
