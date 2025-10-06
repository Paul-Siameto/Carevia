import { jsx as _jsx } from "react/jsx-runtime";
import { AuthProvider } from "../auth/AuthContext";
const Providers = ({ children }) => {
    return _jsx(AuthProvider, { children: children });
};
export default Providers;
