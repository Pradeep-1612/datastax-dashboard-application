import { useSelector } from "react-redux";
import QueryInputComponent from "../components/query-input.component";
import QueryOutputComponent from "../components/query-output.component";
import { selectQueryResult } from "../store/reducer";
import "./query-editor-base.container.css";
import ToolsComponent from "../components/tools.component";

function QueryEditorBaseContainer() {
  const queryResult = useSelector(selectQueryResult);

  return (
    <div className="query-editor-base">
      <div className="query-guide-align">
        <div className="left">
          <QueryInputComponent />
          <br></br>
          {queryResult && <QueryOutputComponent />}
        </div>
        <div className="right">
          <br></br>
          <br></br>
          <ToolsComponent />
        </div>
      </div>
    </div>
  );
}
export default QueryEditorBaseContainer;
