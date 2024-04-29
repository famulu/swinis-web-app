import Image from "next/image";
import Countdown from "./Countdown";

export default function Event(props: { imageUrl: string; timestamp: number }) {
  return (
    <div className="lg:flex">
      <Countdown timestamp={props.timestamp} />
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
