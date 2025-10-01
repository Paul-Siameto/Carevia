import React from "react";
import { AuthProvider } from "../auth/AuthContext";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;


