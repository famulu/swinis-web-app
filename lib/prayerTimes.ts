import { NumberPrayerTimes } from "adhan-clock";
import { Firestore, doc, getDoc } from "firebase/firestore";

export function getIqamahTimes(
  prayTimes: NumberPrayerTimes,
  hardcodedTimes: any,
  offsetTimes: any,
) {
  const prayerNames = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ] as const;

  return prayerNames.map((prayer) => ({
    name: prayer,
    adhan: to12HourFormat(prayTimes[prayer]),
    iqamah: getIqamahTime(prayer, hardcodedTimes, prayTimes, offsetTimes),
  }));
}

export type RegularPrayerNames =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";
export function getIqamahTime(
  timeName: RegularPrayerNames,
  hardcodedTimes: HardcodedIqamahTimes,
  prayTimes: NumberPrayerTimes,
  offsetTimes: IqamahOffset,
): string {
  let hardcodedTime = hardcodedTimes[timeName];
  if (hardcodedTime !== undefined) {
    return hardcodedTime;
  }

  let time = prayTimes[timeName];
  let offset = offsetTimes[timeName];
  if (offset !== undefined) {
    time += offset / 60;
  }
  return to12HourFormat(time);
}

export function to12HourFormat(time: number): string {
  let minutes = Math.round(time * 60);
  let hours = Math.floor(minutes / 60) % 24;
  minutes %= 60;

  let suffix = hours < 12 ? "am" : "pm";
  hours = hours % 12 || 12;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
}

export type PrayerData = {
  hardcodedIqamah: HardcodedIqamahTimes;
  iqamahOffset: IqamahOffset;
  friday: {
    adhan: string;
    iqamah: string;
    name: "jumu'ah 1" | "jumu'ah 2";
  }[];
};

/** Number of minutes from athan to iqamah */
export type IqamahOffset = {
  [name in OutputPrayerNames]?: number;
};

export type OutputPrayerNames =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "jumu'ah 1"
  | "jumu'ah 2";

export type HardcodedIqamahTimes = Partial<Record<OutputPrayerNames, string>>;

export async function getPrayerData(db: Firestore): Promise<PrayerData> {
  const docRef = doc(db, "prayers", "prayerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PrayerData;
  }

  throw "No such document!";
}
