import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionDetector = () => {
    const videoRef = useRef(null);  // Reference for the webcam video
    const canvasRef = useRef(null); // Reference for the overlay canvas
    const [expression, setExpression] = useState("Detecting..."); // State to store the detected expression

    useEffect(() => {
        const loadModels = async () => {    
            // Load Face-API models
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        };

        const setupCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        loadModels().then(setupCamera);
    }, []);

    useEffect(() => {
        const detectExpressions = async () => {
            if (!videoRef.current) return;

            const canvas = canvasRef.current;
            const displaySize = {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
            };

            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                const detections = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (detections) {
                    const expressions = detections.expressions;
                    const maxExpression = Object.keys(expressions).reduce((a, b) =>
                        expressions[a] > expressions[b] ? a : b
                    );

                    setExpression(maxExpression.charAt(0).toUpperCase() + maxExpression.slice(1));
                } else {
                    setExpression("No Face Detected");
                }
            }, 500);
        };

        videoRef.current?.addEventListener("loadeddata", detectExpressions);
    }, []);

    return (
        <div style={{ textAlign: "center", position: "relative" }}>
            <h1>Face Expression Detection (Face-API.js)</h1>
            <video ref={videoRef} autoPlay playsInline width="640" height="480"></video>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }}></canvas>
            <h2>Expression: {expression}</h2>
        </div>
    );
};

export default FaceExpressionDetector;
