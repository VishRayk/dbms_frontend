import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultyLogin = () => {
  const [credentials, setCredentials] = useState({
    f_email: "",
    f_password: ""
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const res = await axios.post("http://localhost:3000/auth/faculty/login", credentials);
      setMessage(res.data.message); // Show success message
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('theme', 'green-orange'); // or any custom identifier
      setTimeout(() => navigate("/scheduled-appointment"), 1000); // Redirect after short delay
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Faculty Login</h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
        )}

        <input
          name="f_email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg mb-3"
        />
        <input
          name="f_password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg mb-6"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/faculty-signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FacultyLogin;
