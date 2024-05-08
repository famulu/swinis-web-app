"use client";
import { PrayerData, getPrayerData } from "@/lib/db";
import { useEffect, useState } from "react";
import PrayerSchedule from "@/components/PrayerSchedule";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import revalidate from "@/app/actions";

export default function Page() {
  const [prayerData, setPrayerData] = useState<PrayerData>();
  const [finalPrayerData, setFinalPrayerData] = useState<PrayerData>();
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    getPrayerData().then((data) => {
      setPrayerData(data);
      setFinalPrayerData(data);
    });
  }, []);

  const prayerNames: Array<Exclude<keyof PrayerData, "friday">> = [
    "fajr",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ];

  const fridayPrayerNames: Array<keyof PrayerData["friday"]> = [
    "jumu'ah 1",
    "jumu'ah 2",
  ];

  function validate(prayerData: PrayerData) {
    const errorsFound: string[] = [];
    const warningsFound: string[] = [];
    const pattern = /^(0?[1-9]|1[0-2]):([0-5][0-9]) [AP]M$/i;
    for (const name of prayerNames) {
      const iqamahData = prayerData[name];
      if (iqamahData.type === "offset") {
        if (iqamahData.offset === 0) {
          warningsFound.push(
            `Offset for ${name} is 0. Are you sure this is right?`,
          );
        } else if (iqamahData.offset < 0) {
          errorsFound.push(`Offset for ${name} is negative!`);
        } else if (!iqamahData.offset) {
          errorsFound.push(`Offset for ${name} is empty`);
        } else if (iqamahData.offset > 720) {
          errorsFound.push(`Offset for ${name} is too high!`);
        }
      } else if (!pattern.test(iqamahData.iqamah)) {
        errorsFound.push(
          `Format iqamah for ${name} correctly, e.g. 1:20 pm, 01:20 pm, 11:30 am`,
        );
      }
    }
    for (const fridayPrayer of fridayPrayerNames) {
      const adhanTime = prayerData.friday[fridayPrayer].adhan;
      if (!pattern.test(adhanTime)) {
        errorsFound.push(
          `Format adhan for ${fridayPrayer} correctly, e.g. 1:20 pm, 01:20 pm, 11:30 am`,
        );
      }
    }
    return { errorsFound, warningsFound };
  }

  return prayerData ? (
    <div className="flex flex-col gap-2">
      <form className="flex flex-col gap-2 p-2">
        {prayerNames.map((name) => {
          const iqamahData = prayerData[name];

          return (
            <div key={name} className="border border-black p-2">
              <div className="font-bold capitalize">{name}</div>
              <fieldset className="border border-black p-1">
                <legend>Type</legend>
                <label>
                  Offset{" "}
                  <input
                    type="radio"
                    name={`${name}-type`}
                    value="offset"
                    onChange={(e) => {
                      setPrayerData((prev) => {
                        if (prev === undefined) return prev;
                        const newPrayerData = {
                          ...prev,
                          [name]: { offset: "", type: "offset" },
                        };
                        return newPrayerData;
                      });
                    }}
                    checked={iqamahData.type === "offset"}
                  />
                </label>{" "}
                <label>
                  Fixed{" "}
                  <input
                    type="radio"
                    name={`${name}-type`}
                    value="fixed"
                    onChange={(e) => {
                      setPrayerData((prev) => {
                        if (prev === undefined) return prev;
                        return {
                          ...prev,
                          [name]: { iqamah: "", type: "fixed" },
                        };
                      });
                    }}
                    checked={iqamahData.type === "fixed"}
                  />
                </label>
              </fieldset>
              <div className="p-1"></div>
              {iqamahData.type === "offset" ? (
                <label>
                  Offset{" "}
                  <input
                    type="number"
                    className="rounded border border-black"
                    onChange={(e) => {
                      setPrayerData((prev) => {
                        if (prev === undefined) return prev;
                        return {
                          ...prev,
                          [name]: {
                            ...prev[name],
                            offset: e.target.value,
                          },
                        };
                      });
                    }}
                    value={iqamahData.offset}
                  />
                </label>
              ) : (
                <label>
                  Iqamah{" "}
                  <input
                    className="rounded border border-black"
                    type="text"
                    onChange={(e) => {
                      setPrayerData((prev) => {
                        if (prev === undefined) return prev;
                        return {
                          ...prev,
                          [name]: { ...prev[name], iqamah: e.target.value },
                        };
                      });
                    }}
                    value={iqamahData.iqamah}
                  />
                </label>
              )}
            </div>
          );
        })}
        {fridayPrayerNames.map((name) => (
          <div key={name} className="border border-black p-2">
            <div className="mb-1 font-bold capitalize">{name}</div>
            <label key={name}>
              Adhan{" "}
              <input
                type="text"
                className="rounded border border-black"
                value={prayerData.friday[name].adhan}
                onChange={(e) => {
                  setPrayerData((prev) => {
                    if (prev === undefined) return prev;
                    const newPrayerData = {
                      ...prev,
                      friday: {
                        ...prev.friday,
                        [name]: { adhan: e.target.value },
                      },
                    };
                    return newPrayerData;
                  });
                }}
              />
            </label>
          </div>
        ))}
      </form>
      {errors.map((error, i) => (
        <div key={i} className="text-red-400">
          {error}
        </div>
      ))}
      {warnings.map((warning, i) => (
        <div key={i} className="text-yellow-400">
          {warning}
        </div>
      ))}
      {alerts.map((alert, i) => (
        <div key={i} className="text-emerald-700">
          {alert}
        </div>
      ))}
      <div className="self-center">
        <button
          className="rounded border border-black p-1"
          onClick={() => {
            setErrors([]);
            setWarnings([]);
            setAlerts([]);
            const { errorsFound, warningsFound } = validate(prayerData);
            setErrors(errorsFound);
            setWarnings(warningsFound);
            if (errorsFound.length === 0) {
              setFinalPrayerData(prayerData);
            }
          }}
        >
          Preview
        </button>
        <button
          className="ml-2 rounded border border-black p-1"
          onClick={(e) => {
            setErrors([]);
            setWarnings([]);
            setAlerts([]);
            const { errorsFound, warningsFound } = validate(prayerData);
            setErrors(errorsFound);
            setWarnings(warningsFound);
            if (errorsFound.length === 0) {
              setFinalPrayerData(prayerData);
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
              setDoc(docRef, prayerData).then(() =>
                setAlerts(["Database updated successfully."]),
              );
              revalidate();
            }
          }}
        >
          Submit
        </button>
      </div>

      <PrayerSchedule prayerData={finalPrayerData as PrayerData} />
    </div>
  ) : (
    <p>Loading...</p>
  );
}
