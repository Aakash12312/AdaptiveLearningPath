/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
const Header = ({ isLoggedIn, userName, handleLogout }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleSearch = () => {
        const username = prompt("Enter username to search");
        if (username) {
            navigate(`/user/${username}`);
        }
    };

    const navLinkStyle = {
        color: "white",
        textDecoration: "none",
        fontSize: "0.9rem",
        cursor: "pointer",
        padding: "0.5rem 0",
        lineHeight: "1.5",
    };

    return (
        <header
            style={{
                backgroundColor: "#003c64",
                color: "white",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>THOUGHTLY</div>
            <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <Link to="/blog/allBlogs" style={navLinkStyle}>
                    Home
                </Link>
                {!isLoggedIn ? (
                    <Link to="/user/login" style={navLinkStyle}>
                        Login/Register
                    </Link>
                ) : (
                    <>
                        <div
                            style={{ position: "relative" }}
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={toggleDropdown}
                        >
                            <Link to="/blog/addBlog" style={navLinkStyle}>
                                Add Blog
                            </Link>
                            {isDropdownVisible && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        backgroundColor: "#1E201E",
                                        border: "1px solid #444",
                                        borderRadius: "5px",
                                        zIndex: 1,
                                        minWidth: "150px",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Link to="/blog/addBlog" style={{ ...navLinkStyle, padding: "0.5rem" }}>
                                        Create Blog
                                    </Link>
                                    <Link to="/blog/AI" style={{ ...navLinkStyle, padding: "0.5rem" }}>
                                        Create with AI
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Link to="/user/profile" style={navLinkStyle}>
                            {userName}
                        </Link>
                        <Link to="/user/search" style={navLinkStyle}>
                            Search User
                        </Link>
                        <span onClick={handleLogout} style={navLinkStyle}>
                            Logout
                        </span>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
