import "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

let app;
export let analytics: any;
export let storage: any;

if (firebaseConfig?.projectId) {
  app = initializeApp(firebaseConfig);
  if (app.name && typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }

  // Access Firebase services using shorthand notation
  storage = getStorage();
}
export default app;
