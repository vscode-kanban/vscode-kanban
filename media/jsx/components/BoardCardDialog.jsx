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
  const schema = {
    type: 'object',
    required: [
      'assignedTo',
      'category',
      'prio',
      'title',
      'type'
    ],
    properties: {
      'assignedTo': {
        type: 'string'
      },
      'category': {
        type: 'string'
      },
      'prio': {
        type: 'string',
        pattern: '^([0-9])*$'
      },
      'title': {
        type: 'string',
        minLength: 1
      },
      'type': {
        type: 'string',
        enum: ['', 'bug', 'emergency']
      }
    }
  };

  const schemaInstancePathDisplayNames = {
    '/title': 'Title',
    '/prio': 'Prio'
  };

  window.vscodeKanban.setUIComponent('BoardCardDialog', ({
    board,
    card,
    mode,
    onClose,
    show
  }) => {
    const { t } = window;

    const [Modal, Button, Form, Row, Col, Alert, Tabs, Tab, ListGroup] = window.vscodeKanban.getBootstrapComponents(
      'Modal', 'Button', 'Form', 'Row', 'Col', 'Alert', 'Tabs', 'Tab', 'ListGroup'
    );
    const [CodeEditor] = window.vscodeKanban.getUIComponents(
      'CodeEditor'
    );

    const [activeTab, setActiveTab] = React.useState('shortDescription');
    const [assignedTo, setAssignedTo] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [details, setDetails] = React.useState('');
    const [prio, setPrio] = React.useState('');
    const [selectedReferences, setSelectedReferences] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [type, setType] = React.useState('');
    const [validationError, setValidationError] = React.useState('');

    const handleClose = React.useCallback(() => {
      onClose();
    }, [onClose]);

    const handleSave = React.useCallback(() => {
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

    const otherCards = React.useMemo(() => {
      return _(Object.values(board))
        .sortBy((item) => {
          return String(item.title || '').toLowerCase().trim();
        })
        .value()
        .flat()
        .filter((item) => item.id !== card.id);
    }, [board, card]);

    const hasOtherCards = React.useMemo(() => {
      return otherCards.length > 0;
    }, [otherCards]);

    const renderTitle = React.useCallback(() => {
      if (mode === 'edit') {
        return `Edit card '${title}'`;
      }
    }, [mode, title]);

    const renderValidationError = React.useCallback(() => {
      if (validationError) {
        return (
          <Alert variant="danger">
            {validationError}
          </Alert>
        );
      }

      return null;
    }, [validationError]);

    const renderReferenceList = React.useCallback(() => {
      if (hasOtherCards) {
        return (
          <ListGroup>
            {otherCards.map((card) => {
              const isChecked = selectedReferences.some((item) => item === card.id);

              const handleCheckboxChange = (ev) => {
                let newSelectedReferences = [...selectedReferences];

                if (ev.target.checked) {
                  newSelectedReferences.push(card.id);
                } else {
                  newSelectedReferences = newSelectedReferences.filter((item) => item !== card.id);
                }

                newSelectedReferences = _(newSelectedReferences)
                  .uniq()
                  .value();

                setSelectedReferences(newSelectedReferences);
              };

              return (
                <ListGroup.Item>
                  <Form.Check
                    type="checkbox"
                    label={String(card.title)}
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        );
      }

      return null;
    }, [hasOtherCards, otherCards, selectedReferences]);

    React.useEffect(() => {
      try {
        const ajv = new ajv7();
        const validate = ajv.compile(schema);

        const isValid = validate({
          assignedTo: assignedTo.trim(),
          category: category.trim(),
          prio: prio.trim(),
          title: title.trim(),
          type: type.trim()
        });
        if (isValid) {
          setValidationError('');
        } else {
          setValidationError(validate.errors.map((error) => {
            const fieldName = schemaInstancePathDisplayNames[error.instancePath] ||
              error.instancePath;

            return `${fieldName} ${error.message}`.trim();
          }).join(', '));
        }
      } catch (error) {
        setValidationError(String(error));
      }
    }, [assignedTo, category, prio, title, type]);

    React.useEffect(() => {
      if (mode === 'edit') {
        setTitle(String(card.title || ''));
        setType(String(card.type || '').toLowerCase().trim());
        setCategory(String(card.category || ''));
        setAssignedTo(String(card.assignedTo?.name || ''));
        setDescription(String(card.description?.content || ''));
        setDetails(String(card.details?.content || ''));

        setSelectedReferences(Array.isArray(card.references) ? card.references : []);
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
          className="boardCardDialog"
          size="xl"
        >
          <Modal.Header
            className={headerClasses.join(' ')}
          >
            <Modal.Title>{renderTitle()}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {renderValidationError()}

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
                  <Form.Control
                    type="number" placeholder="0"
                    value={prio}
                    onChange={(ev) => { setPrio(ev.target.value); }}
                  />
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

              {/* descriptions & references */}
              <Row className="mb-3">
                <Col>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(eventKey) => { setActiveTab(eventKey); }}
                  >
                    <Tab eventKey="shortDescription" title="(Short) Description">
                      {activeTab === 'shortDescription' && (<CodeEditor
                        value={description}
                        onChange={setDescription}
                      />)}
                    </Tab>

                    <Tab eventKey="details" title="Details">
                      {activeTab === 'details' && (<CodeEditor
                        value={details}
                        onChange={setDetails}
                      />)}
                    </Tab>

                    <Tab
                      eventKey="references"
                      title="References"
                      disabled={!hasOtherCards}
                    >
                      {renderReferenceList()}
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t('close')}
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!!validationError.length}
            >
              {t('save')}
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  });  
})();
