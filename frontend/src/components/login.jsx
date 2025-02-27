import React, { useState } from "react";
import Header from "./Navbar";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLogin }) => {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false); 
    const [formData, setFormData] = useState({ Name: "", Email: "", Password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister ? "http://localhost:5000/user/signup" : "http://localhost:5000/user/login";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: isRegister ? "same-origin" : "include",
            });

            const result = await response.json();
            if (response.ok) {
                alert(isRegister ? "Registration successful!" : "Login successful!");
                if (!isRegister) {
                    handleLogin(result.user.name);
                    navigate("/");
                } else {
                    setIsRegister(false);
                }
            } else {
                alert(result.error || "Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <>
    <Header />
    <div style={{ marginTop: "80px" }}>  {/* 👈 Add margin here */}
        <div className={`wrapper ${isRegister ? "active" : ""}`}>
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h1>{isRegister ? "Register" : "Login"}</h1>
                    {isRegister && (
                        <div className="input-box">
                            <input type="text" name="Name" placeholder="Username" value={formData.Name} onChange={handleChange} required />
                        </div>
                    )}
                    <div className="input-box">
                        <input type="email" name="Email" placeholder="Email" value={formData.Email} onChange={handleChange} required />
                    </div>
                    <div className="input-box">
                        <input type="password" name="Password" placeholder="Password" value={formData.Password} onChange={handleChange} required />
                    </div>
                    <button type="submit">{isRegister ? "Register" : "Login"}</button>
                    <p>
                        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                        <a href="#" onClick={() => setIsRegister(!isRegister)}>
                            {isRegister ? "Login" : "Register"}
                        </a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</>

    );
};

export default Login;
