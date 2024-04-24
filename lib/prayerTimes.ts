import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase";

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
  const db = getFirestore(app);

  const docRef = doc(db, "prayers", "prayerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PrayerData;
  }

  throw "No such document!";
}
