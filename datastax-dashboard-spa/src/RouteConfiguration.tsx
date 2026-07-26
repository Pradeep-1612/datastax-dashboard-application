import { Navigate, Route, Routes } from "react-router-dom";
import DocumentsBaseContainer from "./documents/containers/documents-base.container";
import IndexesBaseContainer from "./indexes/containers/indexes-base.container";
import ConfigurationsBaseContainer from "./configurations/containers/configurations-base.container";
import QueryEditorBaseContainer from "./query-editor/containers/query-editor-base.container";

function RoutesConfiguration() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/documents" replace />} />
      <Route path="/configurations" element={<ConfigurationsBaseContainer />} />
      <Route path="/documents" element={<DocumentsBaseContainer />}></Route>
      <Route path="/indexes" element={<IndexesBaseContainer />}></Route>
      <Route
        path="/query-editor"
        element={<QueryEditorBaseContainer />}
      ></Route>
    </Routes>
  );
}

export default RoutesConfiguration;
