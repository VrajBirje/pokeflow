import { createContext, useContext, useState } from 'react';
// import { fetchEmails, sendEmail, uploadToDrive } from "./GoogleApi";

const DnDContext = createContext([null, (_) => {}]);
 
export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);
 
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}
 
export default DnDContext;
 
export const useDnD = () => {
  return useContext(DnDContext);
}