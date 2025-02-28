// src/components/Features.jsx
import React from "react";

const Features = () => {
  return (
    <section className="features"> {/* Ensure className matches CSS */}
      <h2>Why Choose Us?</h2>
      <div className="feature-cards">
        <div className="card">
          <h3>Fast Gameplay</h3>
          <p>Enjoy seamless and lag-free gaming.</p>
        </div>
        <div className="card">
          <h3>Multiplayer Mode</h3>
          <p>Play with friends or compete globally.</p>
        </div>
        <div className="card">
          <h3>Daily Rewards</h3>
          <p>Log in daily to earn exciting rewards.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;