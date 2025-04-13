import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    sid: "",
    s_name: "",
    s_email: "",
    s_password: "",
    confirmPassword: "",
    branch: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.s_password !== formData.confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(
        "http://localhost:3000/auth/student/signup",
        dataToSend
      );
      setMessage(response.data.message);
      // Redirect to login page after successful signup
      navigate("/student-login"); // Redirect to login page
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Student Signup</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

        <input
          type="text"
          name="sid"
          placeholder="Student ID"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="text"
          name="s_name"
          placeholder="Full Name"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
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
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="text"
          name="branch"
          placeholder="Branch"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          required
          className="w-full p-3 border rounded-lg mb-6"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
