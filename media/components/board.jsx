/* eslint-disable @typescript-eslint/naming-convention */

const KanbanBoard = () => {
  const [now, setNow] = React.useState("");

  React.useEffect(() => {
      setNow(new Date().toISOString());
  }, []);

  return (
      <React.Fragment>
          <div>TestComponent: {now}</div>
      </React.Fragment>
  );
};

ReactDOM.render(<KanbanBoard />, document.querySelector("#vscode-kanban-board"));
