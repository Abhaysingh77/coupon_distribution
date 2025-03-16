import React, { useState, useEffect } from "react";
import claimCoupon from "./services/coupon.api";
import Cookies from "js-cookie";
import { CookiesProvider, useCookies } from "react-cookie";
import "./App.css";

import formatTime from "./utils/formatTime";

function App() {
  const [couponCode, setCouponCode] = useState(
    localStorage.getItem("couponCode") || null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [cookies, setCookies, removeCookies] = useCookies(["claimedTime"]);
  const [timeLeft, setTimeLeft] = useState(cookies.claimedTime || null);

  useEffect(() => {
    const claimedTime = cookies.claimedTime;

    // console.log(document.cookie);
    console.log("claimed time: " + claimedTime);
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
    console.log("time left: " + timeLeft);
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else {
      removeCookies("claimedTime");
      localStorage.removeItem("couponCode");
      setCouponCode(null);
    }
  }, [timeLeft]);

  return (
    <div className="main">
      <div className="card">
        <h2 className="heading">Claim Your Coupon</h2>
        <h4 className="subheading">
          One user can claim only one coupon per hour
        </h4>
        {couponCode && (
          <div className="coupon-box">
            <h3>Your Coupon Code:</h3>
            <p className="coupon-code">{couponCode}</p>
          </div>
        )}
        {timeLeft > 0 ? (
          <p className="timer">
            You can claim again in: <span>{formatTime(timeLeft)}</span>
          </p>
        ) : (
          !couponCode && (
            <button
              className="btn"
              onClick={() =>
                claimCoupon(
                  setCouponCode,
                  setErrorMessage,
                  setTimeLeft,
                  setCookies
                )
              }
            >
              Claim Coupon
            </button>
          )
        )}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default App;
