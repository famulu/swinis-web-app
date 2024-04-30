import Image from "next/image";
import Countdown from "./Countdown";
import { EventData } from "@/lib/db";

export default function Event(props: EventData) {
  return (
    <div className="lg:flex">
      <Countdown timestamp={props.timestamp} eventName={props.eventName} />
      <Image
        src={props.imageUrl}
        width={450}
        height={450}
        className="w-full lg:w-[450px]"
        alt="Event Poster"
      />
    </div>
  );
}
