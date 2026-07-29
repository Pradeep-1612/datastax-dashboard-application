import { useSelector } from "react-redux";
import { Accordion, AccordionItem } from "@carbon/react";
import "./tools.component.css";
import QueryHistory from "./query-history.component";
import UsageGuideComponent from "./usage-guide.component";
import { selectQueryExecutionTime } from "../store/reducer";
import { getQueryHistory } from "../../utilities/device-store";

const ToolsComponent: React.FC = () => {
  useSelector(selectQueryExecutionTime); // re-render when a query completes

  const historyCount: number = getQueryHistory().length;

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
