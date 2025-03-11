from flask import Flask, Response, jsonify
import cv2
import mediapipe as mp
import numpy as np
from math import sqrt

app = Flask(__name__)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Function to calculate Euclidean distance between two points
def calculate_distance(point1, point2):
    return sqrt((point1.x - point2.x)**2 + (point1.y - point2.y)**2)

# Function to detect facial expressions
def detect_expression(landmarks):
    LEFT_EYE_TOP = 159
    LEFT_EYE_BOTTOM = 145
    RIGHT_EYE_TOP = 386
    RIGHT_EYE_BOTTOM = 374
    MOUTH_LEFT = 61
    MOUTH_RIGHT = 291
    MOUTH_TOP = 13
    MOUTH_BOTTOM = 14

    left_eye_dist = calculate_distance(landmarks[LEFT_EYE_TOP], landmarks[LEFT_EYE_BOTTOM])
    right_eye_dist = calculate_distance(landmarks[RIGHT_EYE_TOP], landmarks[RIGHT_EYE_BOTTOM])
    eye_openness = (left_eye_dist + right_eye_dist) / 2

    mouth_openness = calculate_distance(landmarks[MOUTH_TOP], landmarks[MOUTH_BOTTOM])
    mouth_width = calculate_distance(landmarks[MOUTH_LEFT], landmarks[MOUTH_RIGHT])

    # Expression thresholds (adjust if needed)
    EYE_CLOSED_THRESHOLD = 0.015
    MOUTH_OPEN_THRESHOLD = 0.03

    if mouth_openness > MOUTH_OPEN_THRESHOLD and mouth_width > 0.1:
        return "Surprised/Happy"
    elif eye_openness < EYE_CLOSED_THRESHOLD:
        return "Eyes Closed"
    elif mouth_openness > MOUTH_OPEN_THRESHOLD:
        return "Mouth Open"
    else:
        return "Neutral"

# Capture from the webcam
cap = cv2.VideoCapture(0)

# Generator function to stream video
def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_mesh.process(image)
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            expression = "Neutral"
            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    mp_drawing.draw_landmarks(
                        image=image,
                        landmark_list=face_landmarks,
                        connections=mp_face_mesh.FACEMESH_TESSELATION,
                        landmark_drawing_spec=None,
                        connection_drawing_spec=mp_drawing.DrawingSpec(color=(0,255,0), thickness=1)
                    )

                    # Detect facial expression
                    expression = detect_expression(face_landmarks.landmark)

            # Overlay detected expression
            cv2.putText(
                image, f"Expression: {expression}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2
            )

            _, buffer = cv2.imencode('.jpg', image)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Flask route to return live video feed
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Flask route to return detected expression as JSON
@app.route('/expression')
def get_expression():
    ret, frame = cap.read()
    if not ret:
        return jsonify({"error": "Unable to read frame"}), 500

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            expression = detect_expression(face_landmarks.landmark)
            return jsonify({"expression": expression})

    return jsonify({"expression": "No face detected"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
