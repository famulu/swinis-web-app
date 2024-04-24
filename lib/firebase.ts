import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcoJg9kN0xqk54DdgJXLjBAvODeW01JVs",
  authDomain: "up-ng-swinis-website.firebaseapp.com",
  projectId: "up-ng-swinis-website",
  storageBucket: "up-ng-swinis-website.appspot.com",
  messagingSenderId: "864939860773",
  appId: "1:864939860773:web:94b178435c2ca687ce70cc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export { auth, app };
