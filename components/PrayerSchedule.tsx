import { PrayerData } from "@/lib/prayerTimes";
import { CalculationMethod, Coordinates, PrayerTimes } from "adhan";
import Image from "next/image";
import shapes2 from "@/public/shapes-2.png";

export default function PrayerSchedule(props: { prayerData: PrayerData }) {
  const prayerData = props.prayerData;
  const coordinates = new Coordinates(-37.8226, 145.0354);
  const params = CalculationMethod.MuslimWorldLeague();
  const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Melbourne",
    timeStyle: "short",
    dateStyle: "short",
  });
  const today = new Date();
  let dateStringTuple = dateTimeFormatter
    .format(today)
    .split(",")[0]
    .split("/")
    .reverse();
  const dateTuple = dateStringTuple.map((v) => +v);
  today.setFullYear(dateTuple[0]);
  today.setMonth(dateTuple[1] - 1);
  today.setDate(dateTuple[2]);
  const prayerTimes = new PrayerTimes(coordinates, today, params);

  const prayerNames = [
    "fajr",
    "sunrise",
    "dhuhr",
    "asr",
    "maghrib",
    "isha",
  ] as const;

  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    timeStyle: "short",
  });

  const finalPrayerTimes = [
    ...prayerNames.map((prayer) => {
      const time = prayerTimes[prayer];
      if (prayer === "sunrise") {
        return {
          name: "sunrise",
          adhan: formatter.format(time).toLowerCase(),
          iqamah: "--:--",
        };
      }

      const iqamahData = prayerData[prayer];
      let iqamah: string;
      if (iqamahData.type === "fixed") {
        iqamah = iqamahData.iqamah;
      } else {
        iqamah = formatter.format(
          new Date(time.getTime() + iqamahData.offset * 60000),
        );
      }

      return {
        name: prayer,
        adhan: formatter.format(time),
        iqamah,
      };
    }),
  ];

  const nextPrayer = prayerTimes.nextPrayer();
  let secToNextPrayer = -1;
  let minutesToNextPrayer = -1;
  let hourToNextPrayer = -1;
  const timeForNextPrayer = prayerTimes.timeForPrayer(nextPrayer);
  if (timeForNextPrayer) {
    secToNextPrayer = Math.floor(
      (timeForNextPrayer.getTime() - Date.now()) / 1000,
    );
    minutesToNextPrayer = Math.floor(secToNextPrayer / 60);

    hourToNextPrayer = Math.floor(minutesToNextPrayer / 60);
    minutesToNextPrayer = minutesToNextPrayer % 60;
  }

  return (
    <div className="relative z-0 flex flex-col items-center bg-[#144560] p-4 px-5 text-white lg:order-1 lg:max-w-[450px] lg:px-9">
      <Image
        src={shapes2}
        alt="Fancy Shape"
        priority={true}
        className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-20"
      />
      <Image
        src="/allah.png"
        width={120}
        height={56}
        alt="Allah's name written in Arabic"
      />
      <div className="pb-2 text-4xl font-[850] text-[#C59A5D]">Prayer Time</div>
      <div className="pb-3 text-xl">Prayer time in Swinburne Musalla</div>
      {timeForNextPrayer && (
        <div className="flex w-full justify-between rounded-xl bg-[#C59A5D] px-2 font-bold">
          <span>
            Next: <span className="capitalize">{nextPrayer}</span>
          </span>
          <span>
            {hourToNextPrayer}h {minutesToNextPrayer}min
          </span>
        </div>
      )}

      <table className="w-full text-lg">
        <thead>
          <tr className="text-[#C59A5D]">
            <th></th>
            <th className="px-3 text-center font-[850] italic">Adhaan</th>
            <th className="px-3 text-center font-[850] italic">Iqaamah</th>
          </tr>
        </thead>
        <tbody>
          {finalPrayerTimes.map((prayer, index, array) => {
            return (
              <tr key={index} className="border-b-[1px]">
                <td className="py-2 font-[850] capitalize">{prayer.name}</td>
                <td className="px-3 py-2 text-center font-[850] uppercase">
                  {prayer.adhan}
                </td>
                <td className="px-3 py-2 text-center font-[850] uppercase">
                  {prayer.iqamah}
                </td>
              </tr>
            );
          })}
          <tr className="border-b-[1px]">
            <td className="py-2 font-[850] capitalize">{"Jumu'ah 1"}</td>
            <td
              className="px-3 py-2 text-center font-[850] uppercase"
              colSpan={2}
            >
              {prayerData.friday["jumu'ah 1"].adhan}
            </td>
          </tr>
          <tr className="">
            <td className="py-2 font-[850] capitalize">{"Jumu'ah 2"}</td>
            <td
              className="px-3 py-2 text-center font-[850] uppercase"
              colSpan={2}
            >
              {prayerData.friday["jumu'ah 2"].adhan}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pt-4 text-center text-sm">
        GS308 (Brothers), GS305 (Sisters) | Level 3, George Building (GS),
        Swinburne University of Technology (Hawthorn Campus )
      </div>
    </div>
  );
}
