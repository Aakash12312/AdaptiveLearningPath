import { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";

const FaceExpressionDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [expression, setExpression] = useState("Detecting...");

    useEffect(() => {
        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        const loadFaceMesh = async () => {
            const faceMesh = new FaceMesh({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults((results) => {
                detectExpression(results);
            });

            if (videoRef.current) {
                videoRef.current.onloadeddata = async () => {
                    while (videoRef.current) {
                        await faceMesh.send({ image: videoRef.current });
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                };
            }
        };

        setupCamera();
        loadFaceMesh();
    }, []);

    const calculateDistance = (p1, p2) => {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    };

    const detectExpression = (results) => {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setExpression("No Face Detected");
            return;
        }

        const landmarks = results.multiFaceLandmarks[0];

        const LEFT_EYE_TOP = 159, LEFT_EYE_BOTTOM = 145;
        const RIGHT_EYE_TOP = 386, RIGHT_EYE_BOTTOM = 374;
        const MOUTH_TOP = 13, MOUTH_BOTTOM = 14;
        const MOUTH_LEFT = 61, MOUTH_RIGHT = 291;

        const leftEyeDist = calculateDistance(landmarks[LEFT_EYE_TOP], landmarks[LEFT_EYE_BOTTOM]);
        const rightEyeDist = calculateDistance(landmarks[RIGHT_EYE_TOP], landmarks[RIGHT_EYE_BOTTOM]);
        const eyeOpenness = (leftEyeDist + rightEyeDist) / 2;

        const mouthOpenness = calculateDistance(landmarks[MOUTH_TOP], landmarks[MOUTH_BOTTOM]);
        const mouthWidth = calculateDistance(landmarks[MOUTH_LEFT], landmarks[MOUTH_RIGHT]);

        // Thresholds
        const EYE_CLOSED_THRESHOLD = 0.015;
        const MOUTH_OPEN_THRESHOLD = 0.03;

        let detectedExpression = "Neutral";
        if (mouthOpenness > MOUTH_OPEN_THRESHOLD && mouthWidth > 0.1) detectedExpression = "Surprised/Happy";
        else if (eyeOpenness < EYE_CLOSED_THRESHOLD) detectedExpression = "Eyes Closed";
        else if (mouthOpenness > MOUTH_OPEN_THRESHOLD) detectedExpression = "Mouth Open";

        setExpression(detectedExpression);

        // Draw on Canvas
        drawFaceMesh(results);
    };

    const drawFaceMesh = (results) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (!results.multiFaceLandmarks) return;

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 1;

        results.multiFaceLandmarks.forEach((landmarks) => {
            for (let point of landmarks) {
                ctx.beginPath();
                ctx.arc(point.x * canvas.width, point.y * canvas.height, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    };

    return (
        <div style={{ textAlign: "center", position: "relative" }}>
            <h1>Face Expression Detection (React)</h1>
            <video ref={videoRef} autoPlay playsInline style={{ display: "none" }}></video>
            <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
            <h2>Expression: {expression}</h2>
        </div>
    );
};

export default FaceExpressionDetector;
