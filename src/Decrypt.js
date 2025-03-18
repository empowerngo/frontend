import CryptoJS from "crypto-js";
function Decrypt(cipherText) {
  const SECRET_KEY = import.meta.env?.VITE_DataEncrptionKey;

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) {
      console.error("Decryption failed: Data is empty.");
      return null;
    }
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}

export default Decrypt;
