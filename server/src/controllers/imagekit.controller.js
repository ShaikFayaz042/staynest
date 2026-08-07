import imagekit from "../config/imagekit.js";

export function getImageKitAuth(req, res) {
  try {
    const authParams = imagekit.helper.getAuthenticationParameters();

    res.status(200).json({
      success: true,
      data: {
        token: authParams.token,
        expire: authParams.expire,
        signature: authParams.signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      },
    });
  } catch (err) {
    console.error("ImageKit auth error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate ImageKit authentication",
    });
  }
}
