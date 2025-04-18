import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSignup from "./AdminSignup";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    w_email: "",
    w_password: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/auth/adminstaff/login", credentials);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem('theme', 'green-orange');
      setTimeout(() => navigate("/scheduled-appointment"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignup = () => {
    navigate("/admin-signup");
    setIsSignup(!isSignup);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen px-4 py-10"
      style={{ background: "linear-gradient(135deg, #382f86 60%, #cf5924 100%)" }}
    >
      {isSignup ? (
        <AdminSignup />
      ) : (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 pt-6 pb-4 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Staff Login</h2>
              
              {message && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
                  {message}
                </div>
              )}
            </div>
            
            <form 
              className="px-6 pb-6"
              onSubmit={handleLogin}
            >
              <div className="mb-4">
                <label htmlFor="w_email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="w_email"
                  name="w_email"
                  placeholder="your.email@example.com"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  onChange={handleChange}
                  style={{ "--tw-ring-color": "#382f86" }}
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="w_password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-sm hover:underline transition-colors"
                    style={{ color: "#382f86" }}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="w_password"
                  name="w_password"
                  placeholder="••••••••"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:border-blue-500 text-gray-700"
                  onChange={handleChange}
                  style={{ "--tw-ring-color": "#382f86" }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-70"
                style={{ background: "#382f86" }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleSignup}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: "#cf5924" }}
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
