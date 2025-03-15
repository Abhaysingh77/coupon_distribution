import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./App.css";
import getClientIP from "./utils/getIp";

function App() {
  const [couponCode, setCouponCode] = useState(localStorage.getItem("couponCode") || null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const claimedTime = Cookies.get("claimedTime");
    if (claimedTime) {
      const expirationTime = parseInt(claimedTime, 10) + 3600000;
      const now = Date.now();
      const remainingTime = Math.max(0, expirationTime - now);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        localStorage.removeItem("couponCode");
        setCouponCode(null);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      Cookies.remove("claimedTime");
      localStorage.removeItem("couponCode");
      setCouponCode(null);
    }
  }, [timeLeft]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const claimCoupon = async () => {
    try {
      const clientId = Cookies.get("clientId") || `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      Cookies.set("clientId", clientId, { expires: 7 });

      const res = await axios.post("https://coupon-distribution-ncyi.onrender.com/api/claim", {
        clientId,
        userAgent: navigator.userAgent,
        ip: await getClientIP(),
      });

      if (res.status === 200) {
        const coupon = res.data.coupon.code;
        setCouponCode(coupon);
        localStorage.setItem("couponCode", coupon);
        setErrorMessage("");
        Cookies.set("claimedTime", Date.now().toString(), { expires: 1 / 24 });
        setTimeLeft(3600000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error claiming coupon");
      setCouponCode(null);
    }
  };

  return (
    <div className="main">
      <div className="card">
        <h2 className="heading">Claim Your Coupon</h2>
        <h4 className="subheading">One user can claim only one coupon per hour</h4>
        {couponCode && (
          <div className="coupon-box">
            <h3>Your Coupon Code:</h3>
            <p className="coupon-code">{couponCode}</p>
          </div>
        )}
        {timeLeft > 0 ? (
          <p className="timer">You can claim again in: <span>{formatTime(timeLeft)}</span></p>
        ) : (
          !couponCode && <button className="btn" onClick={claimCoupon}>Claim Coupon</button>
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
