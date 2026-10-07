import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth/authService";

const PublicRoute = () => {

    if (isAuthenticated()) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};
export default PublicRoute;