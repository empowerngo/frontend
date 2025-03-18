import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env?.VITE_DataEncrptionKey;

if (!SECRET_KEY) {
  console.log(SECRET_KEY);
  throw new Error("Missing encryption key in .env file");
}

const encryptData = (data) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

const initialState = {
  userData: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const encrypted = encryptData(action.payload);
      localStorage.setItem("encryptedData", encrypted);
      state.userData = encrypted;
    },
    clearUserData: (state) => {
      localStorage.removeItem("encryptedData");
      localStorage.removeItem("authToken");
      state.userData = null;
    },
  },
});

const persistConfig = {
  key: "root",
  storage,
  serialize: encryptData,
  deserialize: decryptData,
};

const persistedReducer = persistReducer(persistConfig, dataSlice.reducer);

export const { setUserData, clearUserData } = dataSlice.actions;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
