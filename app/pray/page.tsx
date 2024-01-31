import { Adhan, NumberPrayerTimes } from "adhan-clock";
import { initializeApp } from "firebase/app";
import { Firestore, doc, getDoc, getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration

async function getPrayerData(db: Firestore): Promise<PrayerData> {
  const docRef = doc(db, "prayers", "prayerData");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PrayerData;
  }

  throw "No such document!";
}

function getIqamahTimes(
  prayTimes: NumberPrayerTimes,
  hardcodedTimes: any,
  offsetTimes: any
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

type RegularPrayerNames =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha";
function getIqamahTime(
  timeName: RegularPrayerNames,
  hardcodedTimes: HardcodedIqamahTimes,
  prayTimes: NumberPrayerTimes,
  offsetTimes: IqamahOffset
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

function to12HourFormat(time: number): string {
  let minutes = Math.round(time * 60);
  let hours = Math.floor(minutes / 60) % 24;
  minutes %= 60;

  let suffix = hours < 12 ? "am" : "pm";
  hours = hours % 12 || 12;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
}

export default async function Pray() {
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
  const prayerData = await getPrayerData(db);
  const adhan = new Adhan();
  const date = new Date();
  const prayTimes = adhan.getTimes(
    date,
    [-37.8226, 145.0354],
    "auto",
    "auto",
    "Float"
  );
  const hardcodedTimes = prayerData.hardcodedIqamah;
  const offsetTimes = prayerData.iqamahOffset;
  const outputTimes = [
    ...getIqamahTimes(prayTimes, hardcodedTimes, offsetTimes),
    ...prayerData.friday,
  ];
  console.log(outputTimes);
  return (
    <div className="min-h-screen grid place-items-center place-content-center">
      <h1 className="text-xl">Swinburne Musalla</h1>
      <h2 className="text-lg">Prayer Schedule</h2>
      <p>{new Date().toDateString()}</p>
      <a href="https://goo.gl/maps/929uYtPHYsTE9GFn8" className="underline">
        <span>
          Level 3, GS Building, 34 Wakefield Street, Swinburne University of
          Technology, Hawthorn VIC
        </span>
      </a>
      <table className="border-separate border-spacing-2 border border-slate-500">
        <thead>
          <tr>
            <th>Prayers</th>
            <th>Adhan</th>
            <th>Iqamah</th>
          </tr>
        </thead>
        <tbody>
          {outputTimes.map((time) => (
            <tr key={time.name}>
              <td className="capitalize">{time.name}</td>
              <td>{time.adhan}</td>
              <td>{time.iqamah}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type PrayerData = {
  hardcodedIqamah: HardcodedIqamahTimes;
  iqamahOffset: IqamahOffset;
  friday: {
    adhan: string;
    iqamah: string;
    name: "jumu'ah 1" | "jumu'ah 2";
  }[];
};

/** Number of minutes from athan to iqamah */
type IqamahOffset = {
  [name in OutputPrayerNames]?: number;
};

type OutputPrayerNames =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "jumu'ah 1"
  | "jumu'ah 2";

type HardcodedIqamahTimes = Partial<Record<OutputPrayerNames, string>>;
