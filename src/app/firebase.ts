import "firebase/storage";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FB_APIKEY,
  authDomain: process.env.FB_AUTHDOMAIN,
  projectId: process.env.FB_PROJID,
  storageBucket: process.env.FB_STORAGEBUCKET,
  messagingSenderId: process.env.FB_MSGID,
  appId: process.env.FB_APPID,
  measurementId: process.env.FB_MESID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export default app;
