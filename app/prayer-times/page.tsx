import { Adhan } from "adhan-clock";
import { initializeApp } from "firebase/app";
import { getIqamahTimes, getPrayerData } from "@/app/lib/prayerTimes";
import { getFirestore } from "firebase/firestore";

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
  const today = new Date();
  const prayTimes = adhan.getTimes(
    today,
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
  return (
    <div className="min-h-screen grid place-items-center place-content-center bg-[#25283a] text-white font-sans">
      <h1 className="text-4xl font-yeseva">Swinburne Musalla</h1>
      <h2 className="text-2xl font-yeseva">Prayer Schedule</h2>
      <p className="text-xl">{today.toDateString()}</p>
      <a href="https://goo.gl/maps/929uYtPHYsTE9GFn8" className="">
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
