import Image from "next/image";
import shapes2 from "@/public/shapes-2.png";
import { Fragment } from "react";

export default function Event(props: { imageUrl: string; timestamp: number }) {
  let timestampDifference = props.timestamp - Date.now();
  const suffixes = ["days", "hours", "min", "sec"] as const;
  let countdown: Record<(typeof suffixes)[number], number>;
  if (timestampDifference < 0) {
    countdown = { days: 0, hours: 0, min: 0, sec: 0 };
  } else {
    let sec = Math.ceil(timestampDifference / 1000);
    let min = Math.floor(sec / 60);
    sec = sec % 60;
    let hours = Math.floor(min / 60);
    min = min % 60;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    countdown = { days, hours, min, sec };
  }

  return (
    <div className="lg:flex">
      <div className="relative z-0 flex grow flex-col items-center justify-center gap-4 bg-[#104766] py-8 text-white">
        <Image
          src={shapes2}
          alt="Fancy Shape"
          className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <h2 className="text-xl font-bold text-[#C59A5D]">Upcoming Event</h2>
        <p className=" text-2xl italic">Qiyam-ul-Layl</p>
        <div className="flex flex-row gap-1 text-2xl text-[#144560]">
          {suffixes.map((key, index, array) => (
            <Fragment key={key}>
              <div key={key} className="flex flex-col items-center">
                <div className="flex gap-1">
                  {countdown[key]
                    .toString()
                    .padStart(2, "0")
                    .split("")
                    .map((num, i) => {
                      return (
                        <span key={i} className="rounded bg-[#D9D9D9] p-1">
                          {num}
                        </span>
                      );
                    })}
                </div>
                <div className="text-sm font-bold uppercase text-white">
                  {key}
                </div>
              </div>
              {index < array.length - 1 && (
                <span className="text-[#C59A5D]">:</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
      <Image
        src={props.imageUrl}
        width={450}
        height={450}
        className="w-full lg:max-w-[450]"
        alt="Event Poster"
      />
    </div>
  );
}
