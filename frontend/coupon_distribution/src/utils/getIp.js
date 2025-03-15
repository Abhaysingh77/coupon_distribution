import axios from "axios";
const getClientIP = async () => {
    try {
      const res = await axios.get("https://api64.ipify.org?format=json");
      return res.data.ip;
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      return "unknown";
    }
  };
  export default getClientIP