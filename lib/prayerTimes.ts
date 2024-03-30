import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export type RegularPrayerNames =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";

export type OutputPrayerNames = RegularPrayerNames | "jumu'ah 1" | "jumu'ah 2";

/** Number of minutes from athan to iqamah */
export type IqamahOffset = {
  [name in RegularPrayerNames]?: number;
};

export type HardcodedIqamahTimes = Partial<Record<OutputPrayerNames, string>>;
export type PrayerData = {
  hardcodedIqamah: HardcodedIqamahTimes;
  iqamahOffset: IqamahOffset;
  friday: {
    adhan: string;
    iqamah: string;
    name: "jumu'ah 1" | "jumu'ah 2";
  }[];
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
