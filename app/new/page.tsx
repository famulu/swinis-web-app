import Image from "next/image";
import donationBox from "@/public/donate-box.webp";
import swinisLogo from "@/public/swinis.png";
import { MdEmail, MdPhone, MdWhatsapp } from "react-icons/md";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { Fragment } from "react";

export default function Page() {
  const prayerTimes = [
    { prayer: "Fajr", adhaan: "5:45 AM", iqaamah: "6:00 AM" },
    { prayer: "Sunrise", adhaan: "7:45 AM", iqaamah: "8:00 AM" },
    { prayer: "Dhuhr", adhaan: "12:45 PM", iqaamah: "1:00 PM" },
    { prayer: "Asr", adhaan: "3:45 PM", iqaamah: "4:00 PM" },
    { prayer: "Maghrib", adhaan: "7:45 PM", iqaamah: "8:00 PM" },
    { prayer: "Isha", adhaan: "9:45 PM", iqaamah: "10:00 PM" },
  ];

  const countdown = {
    days: 11,
    hours: 11,
    min: 11,
    sec: 11,
  };
  return (
    <>
      <nav>
        <ul className="flex items-center justify-between p-2 font-signika lg:px-[132px] lg:text-xl lg:font-bold">
          <li>Home</li>
          <li>Library</li>
          <li>
            <Image
              src={swinisLogo}
              alt="Swinburne Islamic Society Logo"
              width={135}
              height={63}
            />
          </li>
          <li>Gallery</li>
          <li>About Us</li>
        </ul>
      </nav>
      <main>
        <div className="lg:flex">
          <div className="flex h-[665px] grow flex-col items-center bg-[url('/white-mosque.png')] bg-cover bg-center bg-no-repeat pt-[42px] md:px-32 lg:w-[897px]">
            <Image src="/shahada.png" alt="Shahada" width={218} height={94} />
            <h1 className="text-center font-garamond text-6xl font-medium text-[#47341C]">
              Welcome to Swinburne Islamic Society
            </h1>
          </div>
          <div className="flex flex-col items-center bg-[url('/patterned-blue.png')] p-4 px-9 text-white lg:max-w-[450px]">
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
            <table className="text-xl">
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
                {prayerTimes.map((time, index) => {
                  const border =
                    index < prayerTimes.length - 1 ? "border-b-[1px]" : "";

                  return (
                    <tr key={time.prayer} className={`${border}`}>
                      <td className="py-2 font-[850]">{time.prayer}</td>
                      <td className="px-3 py-2 text-center font-[850]">
                        {time.adhaan}
                      </td>
                      <td className="px-3 py-2 text-center font-[850]">
                        {time.iqaamah}
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
        </div>
        <div className="lg:flex lg:flex-row-reverse">
          <Image
            src="/welcome-back.png"
            width={450}
            height={450}
            className="w-full lg:w-auto"
            alt="Welcome Back Event Poster"
          />
          <div className="flex grow flex-col items-center justify-center gap-4 bg-[#104766] py-8 text-white">
            <h2 className="text-2xl font-bold text-[#C59A5D]">
              Upcoming Event
            </h2>
            <p>Welcome Back Week First Sem 2024</p>
            <div className="flex flex-row gap-1 text-2xl text-[#144560]">
              {Object.entries(countdown).map(([key, value], index, array) => (
                <Fragment key={key}>
                  <div key={key} className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {value
                        .toString()
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
            <button className="rounded bg-[#95B0C9] p-1 px-2 text-xl font-medium italic text-[#144560]">
              All Events
            </button>
          </div>
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
            <button className="self-center rounded bg-white p-1 px-4 italic text-[#144560] hover:underline">
              Donate Now
            </button>
          </div>
        </div>
        <div className="bg-[#868686] p-3"></div>
        <div className="bg-[#646464] p-3"></div>
        <div className="bg-[#95B0C9] bg-[url('/shapes.png')] p-5 text-lg font-bold lg:p-10 lg:text-2xl">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            Recent Event Reels
          </h2>
          <div className="flex items-start justify-around gap-4 pt-4 lg:gap-32">
            <div className="flex aspect-[4/10] w-[20%] flex-col items-center justify-center rounded-3xl bg-[#D9D9D9]">
              Reel 1
            </div>
            <div className="flex aspect-[4/10] w-[20%] flex-col items-center justify-center rounded-3xl bg-[#D9D9D9]">
              Reel 2
            </div>
            <div className="flex aspect-[4/10] w-[20%] flex-col items-center justify-center rounded-3xl bg-[#D9D9D9]">
              Reel 3
            </div>
          </div>
        </div>
        <div className="bg-[#144560] bg-[url('/shapes.png')] p-5 text-lg font-bold text-white lg:p-10 lg:text-2xl">
          <h2 className="text-end text-3xl text-[#C59A5D]">Our Services</h2>
          <div className="flex items-start justify-around pt-4">
            <div className="flex aspect-[2/3] w-[25%] flex-col items-center justify-center rounded-3xl bg-[url('/fancy-shape.png')] bg-cover bg-no-repeat">
              Generic
            </div>
            <div className="mt-10 flex aspect-[2/3] w-[25%] flex-col items-center justify-center rounded-3xl bg-[url('/fancy-shape.png')] bg-cover bg-no-repeat lg:mt-20">
              Generic
            </div>
            <div className="mt-20 flex aspect-[2/3] w-[25%] flex-col items-center justify-center rounded-3xl bg-[url('/fancy-shape.png')] bg-cover bg-no-repeat lg:mt-40">
              Generic
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-[#95B0C9] p-4 text-sm text-white lg:p-8">
        <div className="flex gap-4 lg:gap-32">
          <div>
            <h2 className="text-3xl font-bold text-[#144560]">About Us</h2>
            <div className="pt-2">
              Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum Loreum Ipsum
              Loreum Ipsum Loreum Ipsum Loreum Ipsum
            </div>
            <div className="flex gap-2 pt-2">
              <FaYoutube size={32} />
              <FaFacebook size={32} />
              <FaInstagram size={32} />
              <FaLinkedin size={32} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#144560]">Contact Us</h2>
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
