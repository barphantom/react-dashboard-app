import React from "react"
import {Navigate, Outlet} from "react-router-dom";
import {isTokenValid} from "../utils/auth.ts";

const PrivateRoute: React.FC = () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    const isAuthenticated = isTokenValid(access) || isTokenValid(refresh);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default PrivateRoute;
