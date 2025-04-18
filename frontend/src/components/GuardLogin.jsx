import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const DEV_MODE = true; // Set to false before deploying

function GuardLogin() {
  const [gid, setGid] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (DEV_MODE) {
      alert("Dev mode: OTP skipped. Use any OTP.");
      setOtpSent(true);
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:3000/guard/entry-otp-send", {
        gid,
        phone,
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (DEV_MODE) {
      // 🚧 Dev bypass — skip API call, directly login
      localStorage.setItem("guardLoggedIn", "true");
      navigate("/visitor-form");
      return;
    }
    try {
      // const res = await axios.post("http://localhost:3000/guard/entry-otp-verify", {
      //   gid,
      //   phone,
      //   otp,
      // });
      // alert(res.data.message);
      // setIsLogin(true);
      localStorage.setItem("guardLoggedIn", "true");
navigate("/visitor-form");

      // navigate("/visitor-form");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Guard Login</h2>
          </div>

          <form className="px-6 pb-6">
            <input
              type="text"
              placeholder="Enter GID"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              value={gid}
              onChange={(e) => setGid(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Phone Number"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {!otpSent ? (
              <button
                type="button"
                className="w-full py-3 mb-4 bg-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full py-3 mb-4 bg-green-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                  onClick={verifyOtp}
                >
                  Verify OTP & Login
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default GuardLogin;
