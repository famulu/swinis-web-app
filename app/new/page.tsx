import { signika } from "../../lib/fonts";
import Image from "next/image";

export default function Page() {
  const prayerTimes = [
    { prayer: "Fajr", adhaan: "5:45 AM", iqaamah: "6:00 AM" },
    { prayer: "Sunrise", adhaan: "7:45 AM", iqaamah: "8:00 AM" },
    { prayer: "Dhuhr", adhaan: "12:45 PM", iqaamah: "1:00 PM" },
    { prayer: "Asr", adhaan: "3:45 PM", iqaamah: "4:00 PM" },
    { prayer: "Maghrib", adhaan: "7:45 PM", iqaamah: "8:00 PM" },
    { prayer: "Isha", adhaan: "9:45 PM", iqaamah: "10:00 PM" },
  ];

  return (
    <>
      <nav>
        <ul className="font-signika flex px-[132px] py-4 justify-between items-center text-xl">
          <li>Home</li>
          <li>Library</li>
          <li>
            <Image
              src="/swinis.png"
              alt="Swinburne Islamic Society Logo"
              width={180}
              height={84}
            />
          </li>
          <li>Gallery</li>
          <li>About Us</li>
        </ul>
      </nav>
      <main>
        <div className="flex">
          <div className="bg-[url('/white-mosque.png')] flex flex-col items-center w-[897px] grow h-[665px] bg-center bg-no-repeat bg-cover pt-[42px]">
            <Image src="/shahada.png" alt="Shahada" width={218} height={94} />
            <h1 className=" font-garamond text-center font-medium text-6xl text-[#47341C]">
              Welcome to Swinburne Islamic Society
            </h1>
          </div>
          <div className="flex flex-col bg-[url('/patterned-blue.png')] items-center pt-[18px] text-white px-9">
            <Image
              src="/allah.png"
              width={120}
              height={56}
              alt="Allah's name written in Arabic"
            />
            <div className="text-4xl text-[#C59A5D] font-[850] pb-2">
              Prayer Time
            </div>
            <div className="text-xl pb-3">Prayer time in Swinburne Musalla</div>
            <table className="text-xl">
              <thead>
                <tr className="text-[#C59A5D]">
                  <th></th>
                  <th className="px-3 font-[850] text-center italic">Adhaan</th>
                  <th className="px-3 font-[850] text-center italic">
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
                      <td className="px-3 py-2 font-[850] text-center">
                        {time.adhaan}
                      </td>
                      <td className="px-3 py-2 font-[850] text-center">
                        {time.iqaamah}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
