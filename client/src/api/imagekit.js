import { upload } from "@imagekit/javascript";

const apiUrl = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    credentials: "include",
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || "ImageKit request failed");
  }

  return payload;
}

export async function getImageKitAuth() {
  return request("/imagekit/auth");
}

export async function uploadImages(files, folder = "/staynest") {
  const uploadedUrls = [];

  for (const file of files) {
    const authResponse = await getImageKitAuth();
    const { token, expire, signature, publicKey } = authResponse.data;

    const result = await upload({
      file,
      fileName: file.name,
      token,
      expire,
      signature,
      publicKey,
      useUniqueFileName: true,
      folder,
    });

    uploadedUrls.push(result.url);
  }

  return uploadedUrls;
}
