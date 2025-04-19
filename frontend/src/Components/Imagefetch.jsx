import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImageFetch({ visitorId }) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [imageData, setImageData] = useState(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // To store the video stream for cleanup
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    if (isCapturing) {
      // Start capturing the video stream
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          streamRef.current = stream; // Save stream for cleanup
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
    console.log("Capture started");

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    // Set canvas size to match video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video feed onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the base64 image data
    const capturedImage = canvas.toDataURL('image/jpeg');
    console.log(capturedImage);

    setImageData(capturedImage);  // Store the base64 image data

    // Stop the video stream (turn off the camera)
    const stream = streamRef.current;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    // Disable capturing mode
    setIsCapturing(false);
  };

  const uploadImage = async () => {
    if (!imageData) {
      alert("No image captured!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/visitor/post_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitorId, image: imageData })
      });
  
      const resData = await response.json();
      console.log("Server response:", resData);
  
      if (response.ok) {
        alert('Image uploaded successfully!');
        navigate('/visitor-list'); // Redirect to the visitor entry form after successful upload
      } else {
        alert(resData.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error("Image upload error:", err);
      alert('Error uploading image');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Capture Visitor Image</h2>

      <div className="relative">
        <video ref={videoRef} className="w-full h-72 border border-gray-300" style={{ display: isCapturing ? 'block' : 'none' }}></video>
        <canvas ref={canvasRef} className="w-full h-72 border border-gray-300" style={{ display: isCapturing ? 'none' : 'block' }}></canvas>
      </div>

      {/* Capture Button */}
      <div className="flex justify-center space-x-4 mt-4">
        {!isCapturing ? (
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setIsCapturing(true)}
          >
            Start Camera
          </button>
        ) : (
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            onClick={captureImage}
          >
            Capture Image
          </button>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={uploadImage}
        >
          Upload Image
        </button>
      </div>
    </div>
  );
}
