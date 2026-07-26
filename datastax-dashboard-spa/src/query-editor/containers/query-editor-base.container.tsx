import { useSelector } from "react-redux";
import QueryInputComponent from "../components/query-input.component";
import QueryOutputComponent from "../components/query-output.component";
import { selectQueryResult } from "../store/reducer";

function QueryEditorBaseContainer() {
  const queryResult = useSelector(selectQueryResult);

  return (
    <div className="query-editor-base">
      <QueryInputComponent />
      <br></br>
      {queryResult && <QueryOutputComponent />}
    </div>
  );
}
export default QueryEditorBaseContainer;
