import { useSelector } from "react-redux";
import QueryInputComponent from "../components/query-input.component";
import QueryOutputComponent from "../components/query-output.component";
import { selectQueryResult } from "../store/reducer";

function ManageDataBaseContainer() {
  const queryResult = useSelector(selectQueryResult);

  return (
    <div className="manage-data-base">
      <QueryInputComponent />
      <br></br>
      {queryResult && <QueryOutputComponent />}
    </div>
  );
}
export default ManageDataBaseContainer;
