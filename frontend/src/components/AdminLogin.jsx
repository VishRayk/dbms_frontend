import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    w_email: "",
    w_password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/auth/adminstaff/login", credentials);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('theme', 'green-orange');
      setTimeout(() => navigate("/scheduled-appointment"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle,_#ff6a26,_#ff8d59)] px-4">
      <form
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-[#393086]"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Staff Login</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

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
          className="w-full p-3 border rounded-lg mb-6"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-[#393086] text-white p-3 rounded-lg hover:bg-[#2e276b]"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-700">Don't have an account? </span>
          <a href="/admin-signup" className="text-[#393086] hover:underline">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
