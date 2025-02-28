// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Wrap the logo in a Link to redirect to the home page */}
      <Link to="/" className="logo">
        MyGame
      </Link>
      <div className="nav-buttons">
        <Link to="/login">
          <button className="play-now">Play Now</button>
        </Link>
        <Link to="/register">
          <button className="register">Register</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;