import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = () => {
    const { currentUser, isLoading, setupStatus } = useAuth();

    if (isLoading) {
        return null;
    }

    if (setupStatus.setupRequired) {
        return <Navigate to="/setup" replace />;
    }

    if (currentUser?.role !== "ROLE_ADMIN") {
        return <Navigate to="/persons" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
