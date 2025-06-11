// src/services/cloudinary.ts
export const uploadToCloudinary = async (
  file: File
): Promise<{ secure_url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "portfolio-upload"); // ← remplace par le tien

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/djidfwdat/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error("Échec de l'upload sur Cloudinary");

  return { secure_url: data.secure_url, public_id: data.public_id };
};
