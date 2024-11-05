"use client";

import Image from "next/image";
import shapes2 from "@/public/shapes-2.png";
import { Fragment, useEffect, useState } from "react";

function getTimeLeft(timestamp: number) {
  let timestampDifference = timestamp - Date.now();
  let countdown;
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

  return countdown;
}

const suffixes = ["days", "hours", "min", "sec"] as const;

export default function Countdown(props: {
  timestamp: number;
  eventName: string;
  eventLink: string;
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(props.timestamp));

  useEffect(() => {
    const intervalId = setInterval(() => {
      let cancelInterval = true;
      for (const suffix of suffixes) {
        if (timeLeft[suffix] !== 0) {
          cancelInterval = false;
          break;
        }
      }
      if (cancelInterval) {
        clearInterval(intervalId);
        return;
      }

      setTimeLeft(getTimeLeft(props.timestamp));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [props.timestamp, timeLeft]);

  return (
    <div className="relative z-0 flex grow flex-col items-center justify-center gap-4 bg-[#104766] py-8 text-white">
      <Image
        src={shapes2}
        alt="Fancy Shape"
        className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <h2 className="text-xl font-bold text-[#C59A5D]">Upcoming Event</h2>
      <p className=" text-2xl italic">{props.eventName}</p>
      <div className="flex flex-row gap-1 text-2xl text-[#144560]">
        {suffixes.map((key, index, array) => (
          <Fragment key={key}>
            <div key={key} className="flex flex-col items-center">
              <div className="flex gap-1">
                {timeLeft[key]
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
      {props.eventLink && (
        <a
          href={props.eventLink}
          className="text-lg underline hover:no-underline"
        >
          Register Here
        </a>
      )}
    </div>
  );
}
