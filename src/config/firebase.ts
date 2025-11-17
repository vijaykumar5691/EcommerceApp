import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw1DMBBrH9Tc4GxaAKn6rPkGtn1C8-j3M",
  authDomain: "ecommerceapp-7a7e9.firebaseapp.com",
  projectId: "ecommerceapp-7a7e9",
  storageBucket: "ecommerceapp-7a7e9.firebasestorage.app",
  messagingSenderId: "98861086146",
  appId: "1:98861086146:web:0634245424fc587955525b",
  measurementId: "G-NL3J1H4TBG",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
export default app;
