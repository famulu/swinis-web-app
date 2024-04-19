import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export type Iqamah =
  | { offset: number; type: "offset" }
  | { iqamah: string; type: "fixed" };

export type FridayPrayer = { adhan: string };

export type PrayerData = {
  fajr: Iqamah;
  dhuhr: Iqamah;
  asr: Iqamah;
  maghrib: Iqamah;
  isha: Iqamah;
  friday: {
    "jumu'ah 1": FridayPrayer;
    "jumu'ah 2": FridayPrayer;
  };
};

export async function getPrayerData(): Promise<PrayerData> {
  const firebaseConfig = {
    apiKey: "AIzaSyCcoJg9kN0xqk54DdgJXLjBAvODeW01JVs",
    authDomain: "up-ng-swinis-website.firebaseapp.com",
    projectId: "up-ng-swinis-website",
    storageBucket: "up-ng-swinis-website.appspot.com",
    messagingSenderId: "864939860773",
    appId: "1:864939860773:web:94b178435c2ca687ce70cc",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const docRef = doc(db, "prayers", "prayerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PrayerData;
  }

  throw "No such document!";
}
