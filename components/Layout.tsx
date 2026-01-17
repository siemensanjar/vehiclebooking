
import React from 'react';

// This component acts as a transparent wrapper to maintain compatibility 
// with existing code while rendering the restored one-page experience.
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default Layout;
