// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";

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
        </Routes>

        {/* Footer is displayed on all pages */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;