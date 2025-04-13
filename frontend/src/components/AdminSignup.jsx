import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirecting to login page

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    w_name: "",
    w_email: "",
    w_password: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Using navigate hook for redirection

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/adminstaff/signup", formData);
      setMessage(res.data.message);
      setTimeout(() => navigate("/admin-login"), 2000); // Redirect to login after 2 seconds
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
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Admin Staff Signup</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

        <input
          type="text"
          name="w_name"
          placeholder="Name"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="email"
          name="w_email"
          placeholder="Email"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="password"
          name="w_password"
          placeholder="Password"
          required
          className="w-full p-3 border rounded-lg mb-3"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
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

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <a href="/admin/login" className="text-blue-600 hover:text-blue-700">Login</a>
        </div>
      </form>
    </div>
  );
};

export default AdminSignup;
