import { createContext, useContext, useState } from "react";

const AppsFlowContext = createContext([null, () => {}]);

export const AppsFlowProvider = ({ children }) => {
  const [draggedNodeType, setDraggedNodeType] = useState(null);

  return (
    <AppsFlowContext.Provider value={[draggedNodeType, setDraggedNodeType]}>
      {children}
    </AppsFlowContext.Provider>
  );
};

export const useAppsFlow = () => useContext(AppsFlowContext);
