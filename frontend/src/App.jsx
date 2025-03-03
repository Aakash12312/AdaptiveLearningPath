import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AfterLoginPage from "./pages/AfterLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <Router>
            <div className="app">
                {/* Navbar is displayed on all pages */}
                <Navbar />

                {/* Define routes for different pages */}
                <Routes>
                    {/* Home Page */}
                    <Route
                        path="/"
                        element={
                            <>
                                <Hero />
                                <Features />
                            </>
                        }
                    />

                    {/* Register Page */}
                    <Route path="/register" element={<Register />} />

                    {/* Login Page */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Route for AfterLoginPage */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/after-login" element={<AfterLoginPage />} />
                    </Route>
                </Routes>

                {/* Footer is displayed on all pages */}
                <Footer />
            </div>
        </Router>
    );
};

export default App;