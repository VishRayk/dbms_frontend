import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DEV_MODE = true; // Set to false before deploying

function GuardLogin() {
  const [gid, setGid] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (DEV_MODE) {
      alert("Dev mode: OTP skipped. Use any OTP.");
      setOtpSent(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/guard/entry-otp-send", {
        gid,
        phone,
      });
      alert(res.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (DEV_MODE) {
      // 🚧 Dev bypass — skip API call, directly login
      localStorage.setItem("guardLoggedIn", "true");
      navigate("/visitor-form");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/guard/entry-otp-verify", {
        gid,
        phone,
        otp,
      });
      alert(res.data.message);
      // setIsLogin(true);
      localStorage.setItem('token',res.data.gjson.token)
      localStorage.setItem("guardLoggedIn", "true");
      navigate("/visitor-form");
    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
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
            {message && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">
                {message}
              </div>
            )}
          </div>

          <form className="px-6 pb-6">
            <div className="mb-4">
              <label htmlFor="gid" className="block text-sm font-medium text-gray-700 mb-1">
                GID
              </label>
              <input
                type="text"
                id="gid"
                name="gid"
                placeholder="Enter GID"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={gid}
                onChange={(e) => setGid(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Enter Phone Number"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {!otpSent ? (
              <button
                type="button"
                className="w-full py-3 mb-4 bg-[#382f86] text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                onClick={sendOtp}
                disabled={isLoading}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter OTP"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="w-full py-3 mb-4 bg-green-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-200"
                  onClick={verifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying OTP..." : "Verify OTP & Login"}
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
