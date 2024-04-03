import Image from "next/image";
import donationBox from "@/public/donate-box.webp";
import swinisLogo from "@/public/swinis.png";
import shapes2 from "@/public/shapes-2.png";
import fancyShape from "@/public/fancy-shape.png";
import banner from "@/public/banner.png"
import { MdEmail, MdPhone, MdWhatsapp } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Fragment } from "react";
import { getPrayerData } from "@/lib/prayerTimes";
import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";

export const dynamic = "force-dynamic";

export default async function Page() {
  const {
    hardcodedIqamah,
    iqamahOffset,
    friday: fridayPrayers,
  } = await getPrayerData();

  const coordinates = new Coordinates(-37.8226, 145.0354);
  const params = CalculationMethod.MuslimWorldLeague();
  const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Melbourne",
    timeStyle: "short",
    dateStyle: "short"
  });
  const today = new Date()
  const dateTuple = dateTimeFormatter.format(today).split(",")[0].split('/').toReversed().map(v => +v)
  today.setFullYear(dateTuple[0])
  today.setMonth(dateTuple[1] - 1)
  today.setDate(dateTuple[2])
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
      const iqamah = hardcodedIqamah[prayer];
      const finalTime =
        iqamah ||
        formatter.format(
          new Date(time.getTime() + (iqamahOffset[prayer] || 0) * 60000),
        );
      return {
        name: prayer,
        adhan: formatter.format(time).toLowerCase(),
        iqamah: finalTime,
      };
    }),
    ...fridayPrayers,
  ];


  // @ts-ignore
  let secToNextPrayer = Math.floor((prayerTimes.timeForPrayer(prayerTimes.nextPrayer()) - (new Date())) / 1000)
  let minutesToNextPrayer = Math.floor(secToNextPrayer / 60)

  let hourToNextPrayer = Math.floor(minutesToNextPrayer / 60)
  minutesToNextPrayer = minutesToNextPrayer % 60


  const nextPrayer = prayerTimes.nextPrayer()
  const countdown = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  };
  return (
    <>
      <nav className="z-0 relative">
        <Image
          src={banner}
          alt="Fancy Shape"
          className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
        />
        <ul className="flex items-center lg:justify-center p-2 font-signika  lg:text-xl lg:font-bold">
          <li>
            <Image
              src={swinisLogo}
              alt="Swinburne Islamic Society Logo"
              width={135}
              height={63}
            />
          </li>
        </ul>
      </nav>
      <main>
        <div className="lg:flex">
          <div className="lg:order-1 bg-[#144560] z-0 relative flex flex-col items-center p-4 px-9 text-white lg:max-w-[450px]">
            <Image
              src={shapes2}
              alt="Fancy Shape"
              className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-20"
            />
            <Image
              src="/allah.png"
              width={120}
              height={56}
              alt="Allah's name written in Arabic"
            />
            <div className="pb-2 text-4xl font-[850] text-[#C59A5D]">
              Prayer Time
            </div>
            <div className="pb-3 text-xl">Prayer time in Swinburne Musalla</div>
            {
              nextPrayer !== 'none' && (
                <div className="flex w-full justify-between bg-[#C59A5D] rounded-xl px-2 font-bold">
                <span >
                  Next: <span className="capitalize">{nextPrayer}</span>
                </span>
                <span>{hourToNextPrayer}h {minutesToNextPrayer}min</span>
              </div>
              )
            }
           
            <table className="text-xl w-full">
              <thead>
                <tr className="text-[#C59A5D]">
                  <th></th>
                  <th className="px-3 text-center font-[850] italic">Adhaan</th>
                  <th className="px-3 text-center font-[850] italic">
                    Iqaamah
                  </th>
                </tr>
              </thead>
              <tbody>
                {finalPrayerTimes.map((prayer, index, array) => {
                  const border =
                    index < array.length - 1 ? "border-b-[1px]" : "";

                  const bg = "opacity-100"

                  return (
                    <tr key={prayer.name} className={`${border} ${index !== 4 && bg} ${index === 4 && "text-[#C59A5D]"}`}>
                      <td className="py-2 font-[850] capitalize">
                        {prayer.name}
                      </td>
                      <td className="px-3 py-2 text-center font-[850] uppercase">
                        {prayer.adhan}
                      </td>
                      <td className="px-3 py-2 text-center font-[850] uppercase">
                        {prayer.iqamah}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pt-4 text-center text-sm">
              GS308 (Brothers), GS305 (Sisters) | Level 3, George Building (GS),
              Swinburne University of Technology (Hawthorn Campus )
            </div>
          </div>
          <div className=" lg:flex relative flex lg:h-[665px] h-[350px] grow flex-col items-center lg:w-[897px]">
            <iframe className="grow w-full" src="https://www.youtube.com/embed/hOi14yCp9PY?si=2AttNtQDcaoux7PV" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
          </div>
        </div>
        <div className="lg:flex">
          <div className="relative z-0 flex grow flex-col items-center justify-center gap-4 bg-[#104766] py-8 text-white">
            <Image
              src={shapes2}
              alt="Fancy Shape"
              className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-30"
            />
            <h2 className="text-[#C59A5D] font-bold text-xl">
              Upcoming Event
            </h2>
            <p className=" text-2xl italic">Qiyam-ul-Layl</p>
            <div className="flex flex-row gap-1 text-2xl text-[#144560]">
              {Object.entries(countdown).map(([key, value], index, array) => (
                <Fragment key={key}>
                  <div key={key} className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {value
                        .toString()
                        .padStart(2, '0')
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
            src="/qiyam.png"
            width={450}
            height={450}
            className="w-full lg:w-auto"
            alt="Qiyam-ul-Layl Poster"
          />
        </div>
        <div className="flex h-full bg-gradient-to-tr from-[#f2edea] via-[#e5d5c8] via-90% to-[#d2b7a2] p-4 lg:p-8">
          <Image
            src={donationBox}
            alt="Donation Box"
            className="w-fit self-end"
          />
          <div className="ml-auto flex w-[50%] flex-col items-end gap-4 lg:gap-8 lg:text-2xl">
            <h2 className="text-2xl font-bold text-[#144560] lg:text-4xl">
              Support Us
            </h2>
            <p className="text-justify">
              Prophet Muhammad ﷺ said: &quot;The believer&apos;s shade on the
              Day of Resurrection will be their charity.&quot;
            </p>
            <p className="self-center">(Tirmidhi)</p>
            <a href="https://square.link/u/7K6VkFZn" className="self-center rounded bg-white p-1 px-4 italic text-[#144560] hover:underline">
              Donate Now
            </a>
          </div>
        </div>
        <div className="bg-[#868686] p-3"></div>
        <div className="bg-[#646464] p-3"></div>
        <div className="relative -z-20 bg-[#144560] p-5 text-lg font-bold text-white lg:p-10 lg:text-2xl">
          <Image
            src={shapes2}
            alt="Fancy Shape"
            className="absolute left-0 top-0 -z-10 h-full w-full object-cover opacity-30"
          />
          <h2 className="text-end text-3xl text-[#C59A5D]">Our Services</h2>
          <div className="flex items-start justify-around pt-4">
            <div className="relative flex aspect-[2/3] w-[30%] flex-col items-center justify-center text-center">
              <Image
                src={fancyShape}
                alt="Fancy Shape"
                className="absolute -z-10 h-full w-full rounded-3xl object-cover object-right-top"
              />
              <span className="mt-10">
                Daily Iftars
              </span>
            </div>
            <div className="relative mt-10 flex aspect-[2/3] w-[30%] flex-col items-center justify-center rounded-3xl text-center lg:mt-20">
              <Image
                src={fancyShape}
                alt="Fancy Shape"
                className="absolute -z-10 h-full w-full rounded-3xl object-cover object-right-top"
              />
              <span className="mt-10">
                5 Daily Prayers
              </span>
            </div>
            <div className="relative mt-20 flex aspect-[2/3] w-[30%] flex-col items-center justify-center rounded-3xl lg:mt-40">
              <Image
                src={fancyShape}
                alt="Fancy Shape"
                className="absolute -z-10 h-full w-full rounded-3xl object-cover object-right-top"
              />
              <span className="mt-10">
                Library
              </span>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-[#95B0C9] p-2 text-xs text-white lg:p-3">
        <div className="flex gap-4 lg:gap-32">
          <div className="grow basis-0">
            <h2 className="text-2xl font-bold text-[#144560]">About Us</h2>
            <div className="pt-2">
              At SWINIS, we strive to create a supportive community for Muslim
              students & staff at Swinburne University of Technology to practice
              their faith, connect with other Muslims, and engage in social and
              educational activities.
            </div>
            <div className="flex gap-2 pt-4">
              <a href="https://www.youtube.com/@swinburne.islamic">
                <FaYoutube size={32} />
              </a>
              <a href="https://www.facebook.com/Swinburneislamic/">
                <FaFacebook size={32} />
              </a>
              <a href="https://www.instagram.com/swinburne.islamic/">
                <FaInstagram size={32} />
              </a>
              <a href="https://www.linkedin.com/company/swinburneislamic/">
                <FaLinkedin size={32} />
              </a>
            </div>
          </div>
          <div className="grow basis-0">
            <h2 className="text-2xl font-bold text-[#144560]">Contact Us</h2>
            <div className="pt-2">
              GS308 (Brothers), GS305 (Sisters) | Level 3, George Building (GS),
              Swinburne University of Technology (Hawthorn Campus )
            </div>
            <div className="flex items-center gap-1 pt-2">
              <MdEmail />
              <a href="mailto:contactus@swinis.org">contactus@swinis.org</a>
            </div>
            <div className="flex items-center gap-1 pt-2">
              <MdPhone />
              <a href={`tel:${process.env.INTERNATIONAL_PHONE}`}>
                {process.env.LOCAL_PHONE}
              </a>
            </div>
            <div className="flex items-center gap-1 pt-2">
              <MdWhatsapp />
              <a href={`https://wa.me/${process.env.WHATSAPP_PHONE}`}>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 text-center">
          All Right Reserved @Swinburne Islamic Society
        </div>
      </footer>
    </>
  );
}
