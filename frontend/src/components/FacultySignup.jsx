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
      navigate("/faculty-login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-10"
      style={{ background: "linear-gradient(135deg, #382f86 60%, #cf5924 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 pt-6 pb-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Faculty Signup</h2>

            {message && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
                {message}
              </div>
            )}
          </div>

          <form className="px-6 pb-6" onSubmit={handleSubmit}>
            <input
              type="text"
              name="f_name"
              placeholder="Full Name"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />
            <input
              type="email"
              name="f_email"
              placeholder="Email"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />
            <input
              type="password"
              name="f_password"
              placeholder="Password"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              required
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              required
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full text-white font-medium py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-200"
              style={{ background: "#382f86" }}
            >
              Sign Up
            </button>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/faculty-login")}
                  className="font-medium hover:underline transition-colors"
                  style={{ color: "#cf5924" }}
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
