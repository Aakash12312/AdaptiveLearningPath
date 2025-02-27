import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Header from "./components/Navbar";
function App() {
  return (
    <>
    <Router> {/* Ensure Router wraps everything */}
      <Routes>
        <Route path="/" element={<Login />} /> {/* Define route for Login */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
