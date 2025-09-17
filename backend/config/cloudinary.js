import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  // Trim to eliminate accidental whitespace / invisible chars
  const rawCloud = (process.env.CLOUDINARY_NAME || "").trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (
    process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET || ""
  ).trim();

  cloudinary.config({
    cloud_name: rawCloud,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Diagnostic output (only when LOG_LEVEL=debug)
  if ((process.env.LOG_LEVEL || '').toLowerCase() === 'debug') {
    console.log("[Cloudinary] Attempting connection", {
      cloud_name: rawCloud,
      api_key_present: Boolean(apiKey),
      secret_present: Boolean(apiSecret),
      cloud_name_length: rawCloud.length,
    });
  }

  // Verification ping to surface clearer errors at startup
  if ((process.env.LOG_LEVEL || '').toLowerCase() === 'debug') {
    try {
      await cloudinary.api.ping();
      console.log("[Cloudinary] Ping successful");
    } catch (err) {
      console.error("[Cloudinary] Verification failed:", err?.message || err);
      console.error(
        "[Cloudinary] Char codes:",
        [...rawCloud].map((c) => c.charCodeAt(0))
      );
    }
  }
};

export default connectCloudinary;
