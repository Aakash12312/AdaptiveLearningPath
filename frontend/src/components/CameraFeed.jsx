import React from "react";

const CameraFeed = () => {
    return (
        <div>
            <h2>Live FaceMesh Feed</h2>
            <img 
                src="http://localhost:5000/video_feed" 
                alt="FaceMesh Feed" 
                width="640" 
                height="480"
            />
        </div>
    );
};

export default CameraFeed;
