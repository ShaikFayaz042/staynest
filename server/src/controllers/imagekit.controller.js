import imagekit from "../config/imagekit.js";

function getFilePathFromImageUrl(url) {
  if (!url || typeof url !== "string") return null;

  try {
    const urlObj = new URL(url);
    return urlObj.pathname.replace(/^\/+/, "");
  } catch {
    const endpoint = process.env.IMAGEKIT_URL_ENDPOINT?.replace(/\/+$/, "");
    if (endpoint && url.startsWith(endpoint)) {
      return url.slice(endpoint.length).replace(/^\/+/, "");
    }
    return url;
  }
}

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

export async function deleteImageKitFile(req, res) {
  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Image URL is required for deletion",
      });
    }

    const filePath = getFilePathFromImageUrl(url);
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "Unable to parse ImageKit file path from URL",
      });
    }

    await imagekit.deleteFile(filePath);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    console.error("ImageKit delete error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete ImageKit file",
    });
  }
}
