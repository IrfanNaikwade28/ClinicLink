import jwt from "jsonwebtoken";

// Unified authentication for either user or doctor tokens
// - Prefers doctor token if both are present
// - Sets req.profileRole in { 'user' | 'doctor' }
// - Sets req.profileId to the authenticated document id
const authProfile = async (req, res, next) => {
  try {
    const { dtoken, token } = req.headers;

    if (dtoken) {
      const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
      req.profileRole = "doctor";
      req.profileId = decoded.id;
      return next();
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.profileRole = "user";
      req.profileId = decoded.id;
      return next();
    }

    return res.json({ success: false, message: "Not Authorized Login Again" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default authProfile;
