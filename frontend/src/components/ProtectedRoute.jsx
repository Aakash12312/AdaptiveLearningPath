import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token"); // Check for token in localStorage

    // If token exists, allow access to the route
    // Otherwise, redirect to the login page
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;