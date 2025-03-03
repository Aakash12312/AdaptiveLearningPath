import React from "react";

const AfterLoginPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="card-title text-center mb-4">Welcome to the After Login Page!</h1>
                <p className="text-center">You have successfully logged in.</p>
            </div>
        </div>
    );
};

export default AfterLoginPage;