import { useSelector } from "react-redux";
import { Accordion, AccordionItem } from "@carbon/react";
import "./tools.component.css";
import QueryHistory, { QUERY_HISTORY_KEY } from "./query-history.component";
import UsageGuideComponent from "./usage-guide.component";
import { selectQueryExecutionTime } from "../store/reducer";

const ToolsComponent: React.FC = () => {
  useSelector(selectQueryExecutionTime); // re-render when a query completes

  const stored = localStorage.getItem(QUERY_HISTORY_KEY);
  const historyCount: number = stored ? JSON.parse(stored).length : 0;

  return (
    <div>
      <Accordion align="end" size="md">
        <AccordionItem title={`History (${historyCount})`}>
          <QueryHistory />
        </AccordionItem>
        <AccordionItem title="Usage guide">
          <UsageGuideComponent />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ToolsComponent;
