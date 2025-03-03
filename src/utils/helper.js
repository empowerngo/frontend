import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../utils/constants";

export const uploadToCloudinary = async (file, fieldName, setValue, setUploading) => {
  if (!file) return null;

  setUploading(true);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    console.log(`Uploading ${fieldName} to Cloudinary...`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log(`Cloudinary Response for ${fieldName}:`, data);

    if (data.secure_url) {
      console.log(`Uploaded ${fieldName} URL:`, data.secure_url);
      setValue(fieldName, data.secure_url);
      toast.success(`${fieldName} uploaded successfully!`);
      return data.secure_url;
    } else {
      console.error(`Error: Cloudinary response did not contain secure_url for ${fieldName}`);
      throw new Error("File uploaded but no URL returned.");
    }
  } catch (error) {
    console.error(`Error uploading ${fieldName}:`, error);
    toast.error(`Error uploading ${fieldName}: ${error.message}`);
    return null;
  } finally {
    setUploading(false);
  }
};



