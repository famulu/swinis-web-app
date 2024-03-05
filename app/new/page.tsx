import Image from "next/image";
import donationBox from "../../public/donate-bg.png";

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
        <ul className="font-signika flex px-[132px] py-4 justify-between items-center text-xl font-bold">
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
          <div className="bg-[url('/white-mosque.png')] flex flex-col items-center w-[897px] grow h-[665px] bg-center bg-no-repeat bg-cover pt-[42px] md:px-32">
            <Image src="/shahada.png" alt="Shahada" width={218} height={94} />
            <h1 className="font-garamond text-center font-medium text-6xl text-[#47341C]">
              Welcome to Swinburne Islamic Society
            </h1>
          </div>
          <div className="flex flex-col bg-[url('/patterned-blue.png')] items-center pt-[18px] text-white px-9 max-w-[450px]">
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
            <div className="text-center text-sm pt-4">
              GS308 (Brothers), GS305 (Sisters) | Level 3, George Building (GS),
              Swinburne University of Technology (Hawthorn Campus )
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-col justify-center items-center gap-4 py-8 bg-[#104766] text-white grow">
            <h2 className="text-2xl text-[#C59A5D] font-bold">
              Upcoming Event
            </h2>
            <p>Welcome Back Week First Sem 2024</p>
            <div className="flex flex-row text-2xl text-[#144560] gap-1">
              {Object.entries(countdown).map(([key, value], index, array) => (
                <>
                  <div key={key} className="flex flex-col items-center">
                    <div className="flex gap-1">
                      {value
                        .toString()
                        .split("")
                        .map((num, i) => {
                          return (
                            <span key={i} className="bg-[#D9D9D9] p-1 rounded">
                              {num}
                            </span>
                          );
                        })}
                    </div>
                    <div className="text-white uppercase text-sm font-bold">
                      {key}
                    </div>
                  </div>
                  {index < array.length - 1 && (
                    <span className="text-[#C59A5D]">:</span>
                  )}
                </>
              ))}
            </div>
            <button className="bg-[#95B0C9] text-[#144560] italic text-xl p-1 px-2 rounded font-medium">
              All Events
            </button>
          </div>
          <Image
            src="/welcome-back.png"
            width={450}
            height={450}
            alt="Welcome Back Event Po  ster"
          />
        </div>
        <div className="relative">
          <Image
            src={donationBox}
            alt="Donation Box"
            className="absolute -z-10"
          />
          <div className="flex flex-col items-end p-14 py-16 text-2xl gap-8 ml-auto w-[50%]">
            <h2 className="text-4xl font-bold text-[#144560]">Support Us</h2>
            <p>
              Prophet Muhammad ﷺ said: "The believer's shade on the Day of
              Resurrection will be their charity."
            </p>
            <p className="self-center">(Tirmidhi)</p>
            <div className="p-4"></div>
            <button className="self-center text-[#144560] bg-white italic p-1 px-4 rounded hover:underline">
              Donate Now
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
