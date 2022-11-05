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
  window.vscodeKanban.setUIComponent('BoardCard', ({
    card,
    onDeleteClick,
    onEditClick
  }) => {
    const [Card] = window.vscodeKanban.getBootstrapComponents('Card');

    const headerClasses = React.useMemo(() => {
      const type = String(card.type).toLowerCase().trim();
  
      const classes = [];
      if (['bug'].includes(type)) {
        classes.push('bg-dark', 'text-light');
      } else if (['emergency'].includes(type)) {
        classes.push('bg-danger', 'text-light');
      } else {
        classes.push('bg-info', 'text-dark');
      }
  
      return classes;
    }, [card.type]);
  
    const renderCardIcon = React.useCallback(() => {
      const type = String(card.type).toLowerCase().trim();
  
      let icon;
      if (['bug'].includes(type)) {
        icon = (
          <i className="fa fa-bug"></i>
        );
      } else if (['emergency'].includes(type)) {
        icon = (
          <i className="fa fa-truck-medical"></i>
        );
      } else {
        icon = (
          <i className="fa fa-screwdriver-wrench"></i>
        );
      }
  
      return (
        <div className="d-flex justify-content-start left">
          {icon}
        </div>
      );
    }, [card.type]);
  
    const renderActionButtons = React.useCallback(() => {
      return (
        <div className="d-flex justify-content-end right">
          <i
            className="fa fa-pen-to-square cardAction"
            onClick={() => { onEditClick(card); }}
          />
  
          <i
            className="fa fa-trash cardAction"
            onClick={() => { onDeleteClick(card); }}
          />
        </div>
      );
    }, [card, onDeleteClick, onEditClick]);
  
    const handleDragStart = React.useCallback((ev) => {
      ev.dataTransfer.setData("text", String(card.id));
    }, [card.id]);
  
    return (
      <Card
        className="boardCard"
        onDragStart={handleDragStart}
        draggable
      >
        <Card.Header className={headerClasses.join(' ')}>
          <div className="header">
            {renderCardIcon()} {renderActionButtons()}
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>{card.title}</Card.Title>
          <Card.Text>
            {card.description?.content}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  });  
})();
