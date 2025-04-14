import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import StudentSignup from "./StudentSignup"; // Import the signup component

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    s_email: "",
    s_password: "",
  });

  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false); // To toggle between login and signup
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous message

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/student/login",
        formData
      );
      setMessage(response.data.message); // Show the response message

      localStorage.setItem("token", response.data.token); // Store the token in localStorage

      // Redirect to schedule-appointment page after successful login
      navigate('/schedule-appointment');
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed"); // Handle error
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup); // Toggle between login and signup
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      {isSignup ? (
        <StudentSignup /> // Render the Signup component when `isSignup` is true
      ) : (
        <form
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Student Login
          </h2>

          {message && (
            <div className="mb-4 text-sm text-center text-red-600">{message}</div>
          )}

          <input
            type="email"
            name="s_email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg mb-3"
            onChange={handleChange}
          />
          <input
            type="password"
            name="s_password"
            placeholder="Password"
            required
            className="w-full p-3 border rounded-lg mb-6"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={toggleSignup}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
