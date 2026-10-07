import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth/authService";

const ProtectedRoute = () => {

    if (!isAuthenticated()) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;