import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImageFetch({ visitorId }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [detectedImagePath, setDetectedImagePath] = useState(null); // AI-detected image path
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [ai, setai] = useState(false)

  function getImagePathById(id) {
    const folderPath = '../../../backend/uploads/visitor_images'; // or '/images/' depending on setup
    const fileName = `${id}.jpg`;
    const fullPath = `${folderPath}/${fileName}`;
    return fullPath;
  }
  useEffect(() => {
    if (isCapturing) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          streamRef.current = stream;
        })
        .catch((err) => {
          console.error('Error accessing camera: ', err);
        });

      return () => {
        const stream = streamRef.current;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      };
    }
  }, [isCapturing]);

  const captureImage = () => {
    setai(false)
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedImage = canvas.toDataURL('image/jpeg');
    setImageData(capturedImage);

    const stream = streamRef.current;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    setIsCapturing(false);
  };

  const uploadImage = async () => {
    if (ai) {
      try {
        const response = await axios.post("http://localhost:3000/visitor/ai-image-post", {
          visitorId: visitorId
        });
  
        console.log("AI Image Post Response:", response.data);
  
        if (response.data.success) {
          alert("AI-generated image info posted successfully!");
        } else {
          alert(response.data.message || "Failed to post AI-generated image.");
        }
      } catch (error) {
        console.error("Error posting AI-generated image:", error);
        alert("Error posting AI-generated image.");
      }
      return
    }
  
    const imageToUpload = detectedImagePath ? detectedImagePath : imageData;
    console.log(imageToUpload);
    if (!imageToUpload) {
      alert("No image to upload!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/visitor/post_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitorId, image: imageToUpload })
      });
  
      const resData = await response.json();
      console.log("Server response:", resData);
  
      if (response.ok) {
        alert('Image uploaded successfully!');
        navigate('/visitor-list');
      } else {
        alert(resData.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert('Error uploading image');
    }
  };
  
  const aiImage = async () => {
    try {
      setai(true)
      const response = await axios.post("http://localhost:5000/detect-faces", {
        visitorId: visitorId,
      });
  
      if (response.data.status === "success") {
        const fullImageURL = `http://localhost:5000/${response.data.image_path}`;
        setDetectedImagePath(fullImageURL);
        alert("Visitor image captured using AI!");
        
      } else {
        alert(response.data.message || "Image detection failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      if (error.response) {
        alert(error.response.data.message || "Server error during image detection.");
      } else if (error.request) {
        alert("No response from the server. Please check if the Python server is running.");
      } else {
        alert("Something went wrong while trying to detect face.");
      }
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Capture Visitor Image</h2>

      <div className="relative">
        <video ref={videoRef} className="w-full h-72 border border-gray-300" style={{ display: isCapturing ? 'block' : 'none' }}></video>
        <canvas ref={canvasRef} className="w-full h-72 border border-gray-300" style={{ display: isCapturing ? 'none' : 'block' }}></canvas>
      </div>

      {detectedImagePath && (
        <div className="text-center">
          <h3 className="text-lg font-medium mt-4">AI Detected Image Preview:</h3>
          <img src={detectedImagePath} alt="Detected Face" className="mx-auto mt-2 w-64 border rounded" />
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-4">
        {!isCapturing ? (
          <button
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setIsCapturing(true)}
          >
            Start Camera
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={captureImage}
          >
            Capture Image
          </button>
        )}

        <button
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          onClick={aiImage}
        >
          Use AI Camera
        </button>

        <button
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={uploadImage}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}