import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FacultySignup() {
  const [formData, setFormData] = useState({
    f_name: "",
    f_email: "",
    f_password: "",
    confirmPassword: "",
    department: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
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

    if (formData.f_password !== formData.confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(
        "http://localhost:3000/auth/faculty/signup",
        dataToSend
      );
      setMessage(response.data.message);
      navigate("/faculty-login"); // Redirect on success
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_#ff6a26,_#ff8d59)] px-4">
      <form
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Faculty Signup</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

        <input
          type="text"
          name="f_name"
          placeholder="Full Name"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="email"
          name="f_email"
          placeholder="Email"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="password"
          name="f_password"
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
          name="department"
          placeholder="Department"
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
