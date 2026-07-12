import { Navigate, Route, Routes } from "react-router-dom";
import DocumentsBaseContainer from "./documents/containers/documents-base.container";
import IndexesBaseContainer from "./indexes/containers/indexes-base.container";
import QueryFiltersBaseContainer from "./query-filters/containers/query-filters-base.container";
import ConfigurationsBaseContainer from "./configurations/containers/configurations-base.container";

function RoutesConfiguration() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/configurations" replace />} />
      <Route path="/configurations" element={<ConfigurationsBaseContainer />} />
      <Route path="/documents" element={<DocumentsBaseContainer />}></Route>
      <Route path="/indexes" element={<IndexesBaseContainer />}></Route>
      <Route
        path="/query-filters"
        element={<QueryFiltersBaseContainer />}
      ></Route>
    </Routes>
  );
}

export default RoutesConfiguration;
