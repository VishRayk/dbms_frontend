import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultyLogin = () => {
  const [credentials, setCredentials] = useState({
    f_email: "",
    f_password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/auth/faculty/login", credentials);
      alert(res.data.message);
      localStorage.setItem("token", response.data.token);
    //   navigate("/home"); // Adjust path as needed after successful login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Faculty Login</h2>
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
