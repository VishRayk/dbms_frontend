import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentSignup from "./StudentSignup";

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    s_email: "",
    s_password: "",
  });

  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/student/login",
        formData
      );
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem('theme', 'green-orange');
      navigate('/scheduled-appointment');
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_#ff6a26,_#ff8d59)] px-4">
      {isSignup ? (
        <StudentSignup />
      ) : (
        <form
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-[#393086]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>

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
            className="w-full bg-[#393086] text-white p-3 rounded-lg hover:bg-[#2e276b]"
          >
            Login
          </button>

          <p className="mt-4 text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={toggleSignup}
              className="text-[#393086] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
