import React from "react";
import { AppsFlowProvider } from "./components/AppsFlowContext";
import WorkflowWrapper from "./components/Workflow";

const AppsFlowPage = () => {
  return (
    <AppsFlowProvider>
      <WorkflowWrapper />
    </AppsFlowProvider>
  );
};

export default AppsFlowPage;
