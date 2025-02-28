// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero"> {/* Ensure className matches CSS */}
      <h1>Welcome to MyGame</h1>
      <p>Experience the ultimate gaming adventure.</p>
      <Link to="/login">
        <button className="cta-button">Get Started</button>
      </Link>
    </section>
  );
};

export default Hero;