import React, { useState, useEffect } from "react";

const ExpressionDisplay = () => {
    const [expression, setExpression] = useState("Loading...");

    useEffect(() => {
        const fetchExpression = async () => {
            try {
                const response = await fetch("http://localhost:5000/expression");
                const data = await response.json();
                setExpression(data.expression);
            } catch (error) {
                console.error("Error fetching expression:", error);
            }
        };

        // Fetch expression every second
        const interval = setInterval(fetchExpression, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h2>Detected Expression: {expression}</h2>
        </div>
    );
};

export default ExpressionDisplay;
