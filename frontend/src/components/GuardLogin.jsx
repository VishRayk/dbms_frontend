// GuardLogin.jsx

import { useState } from "react";
import axios from "axios";

function GuardLogin() {
  const [gid, setGid] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
const [islogin, setislogin] = useState(false)
  const sendOtp = async () => {
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
    try {
    //   const res = await axios.post("http://localhost:3000/guard/entry-otp-verify", {
    //     gid,
    //     phone,
    //     otp,
    //   });
    //   alert(res.data.message);
    setislogin(true)
      // Navigate to a success or dashboard page here if needed
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Guard Login</h2>

      <input
        type="text"
        placeholder="Enter GID"
        className="w-full px-4 py-2 border rounded-md"
        value={gid}
        onChange={(e) => setGid(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Phone Number"
        className="w-full px-4 py-2 border rounded-md"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {!otpSent ? (
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md"
          onClick={sendOtp}
        >
          Send OTP
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-md"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            className="w-full bg-green-600 text-white py-2 rounded-md"
            onClick={verifyOtp}
          >
            Verify OTP & Login
          </button>
        </>
      )}
    </div>
  );
}

export default GuardLogin;
