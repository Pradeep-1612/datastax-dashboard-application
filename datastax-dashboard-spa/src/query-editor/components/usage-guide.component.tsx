import { useState } from "react";
import { CodeSnippet, Dropdown } from "@carbon/react";
import "./usage-guide.component.css";

type OperationValue = "FIND" | "INSERT" | "UPDATE" | "DELETE";

interface OperationItem {
  text: string;
  value: OperationValue;
}

const OPERATION_ITEMS: OperationItem[] = [
  { text: "Find", value: "FIND" },
  { text: "Insert", value: "INSERT" },
  { text: "Update", value: "UPDATE" },
  { text: "Delete", value: "DELETE" },
];

interface UsageExample {
  title: string;
  description: string;
  code: string;
}

const USAGE_EXAMPLES: Record<OperationValue, UsageExample[]> = {
  FIND: [
    {
      title: "findOne — Get a single document",
      description: "Use when you expect one document (typically by _id).",
      code: JSON.stringify(
        {
          findOne: {
            filter: { _id: "cert123" },
            projection: { _id: 1, certificateName: 1, expirationDate: 1 },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "find — Get multiple documents",
      description: "DataStax uses find for multiple documents.",
      code: JSON.stringify(
        {
          find: {
            filter: { status: "ACTIVE", environmentType: "CTE" },
            projection: { _id: 1, certificateName: 1, expirationDate: 1 },
            sort: { expirationDate: 1 },
            options: { limit: 10, skip: 50 },
          },
        },
        null,
        2,
      ),
    },
  ],
  INSERT: [
    {
      title: "insertOne — Insert a single document",
      description: "Insert a single document.",
      code: JSON.stringify(
        {
          insertOne: {
            document: {
              _id: "cert123",
              certificateName: "app-cert",
              status: "ACTIVE",
              environmentType: "CTE",
              expirationDate: 1789107097000,
            },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "insertMany — Insert multiple documents",
      description: "Insert multiple documents.",
      code: JSON.stringify(
        {
          insertMany: {
            documents: [
              {
                _id: "cert123",
                certificateName: "app-cert",
                status: "ACTIVE",
                environmentType: "CTE",
                expirationDate: 1789107097000,
              },
              {
                _id: "cert456",
                certificateName: "gateway-cert",
                status: "ACTIVE",
                environmentType: "CTE",
                expirationDate: 1789207097000,
              },
            ],
          },
        },
        null,
        2,
      ),
    },
  ],
  UPDATE: [
    {
      title: "updateOne — Update the first matching document",
      description: "Example: Change status.",
      code: JSON.stringify(
        {
          updateOne: {
            filter: { _id: "cert123" },
            update: { $set: { status: "EXPIRED" } },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "updateOne — Multiple fields",
      description: "Update multiple fields at once.",
      code: JSON.stringify(
        {
          updateOne: {
            filter: { _id: "cert123" },
            update: {
              $set: {
                status: "EXPIRED",
                updatedBy: "admin",
                updatedDate: 1789107097000,
              },
            },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "updateMany — Update all matching documents",
      description: "Example: Mark all expired certificates.",
      code: JSON.stringify(
        {
          updateMany: {
            filter: {
              expirationDate: { $lt: 1789107097000 },
              status: "ACTIVE",
            },
            update: { $set: { status: "EXPIRED" } },
          },
        },
        null,
        2,
      ),
    },
  ],
  DELETE: [
    {
      title: "deleteOne — Delete first matching document",
      description: "Delete the first document matching the filter.",
      code: JSON.stringify(
        {
          deleteOne: {
            filter: { _id: "cert123" },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "deleteMany — Delete all matching documents",
      description: "Example: Delete by status.",
      code: JSON.stringify(
        {
          deleteMany: {
            filter: { status: "DELETED" },
          },
        },
        null,
        2,
      ),
    },
    {
      title: "deleteMany — Multiple conditions",
      description: "Delete with multiple filter conditions.",
      code: JSON.stringify(
        {
          deleteMany: {
            filter: {
              environmentType: "CTE",
              status: "DELETED",
            },
          },
        },
        null,
        2,
      ),
    },
  ],
};

const UsageGuideComponent: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<OperationItem>(
    OPERATION_ITEMS[0],
  );

  const examples = USAGE_EXAMPLES[selectedOperation.value];

  return (
    <div>
      <Dropdown<OperationItem>
        id="default"
        items={OPERATION_ITEMS}
        itemToString={(item) => (item ? item.text : "")}
        label="Find many"
        selectedItem={selectedOperation}
        onChange={({ selectedItem }) => {
          if (selectedItem) setSelectedOperation(selectedItem);
        }}
        titleText="Choose an operation"
        type="default"
      />
      <div className="usage-examples-list">
        {examples.map((example, index) => (
          <div key={index} className="usage-example-item">
            <p className="usage-example-title">
              {index + 1}. {example.title}
            </p>
            <p className="usage-example-description">{example.description}</p>
            <CodeSnippet type="multi" feedback="Copied!">
              {example.code}
            </CodeSnippet>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageGuideComponent;
