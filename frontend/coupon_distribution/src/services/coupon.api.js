import Cookies from 'js-cookie';
import axios from 'axios';
import getClientIP from '../utils/getIp';

const claimCoupon = async (setCouponCode, setErrorMessage, setTimeLeft, setCookies) => {
    try {
      const clientId = Cookies.get("clientId") || `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      Cookies.set("clientId", clientId, { expires: 7 });

      const res = await axios.post("https://coupon-distribution-ncyi.onrender.com/api/claim", {
        clientId,
        userAgent: navigator.userAgent,
        ip: await getClientIP(),
      });
      console.log(res)

      if (res.status === 200) {
        const coupon = res.data.coupon.code;
        setCouponCode(coupon);
        localStorage.setItem("couponCode", coupon);
        setErrorMessage("");
        setCookies("claimedTime", Date.now().toString());
        setTimeLeft(3600000);
      }
    } catch (error) {
        console.log(error)
      setErrorMessage(error.response?.data?.message || "Error claiming coupon");
      setCouponCode(null);
    }
  };

  export default claimCoupon