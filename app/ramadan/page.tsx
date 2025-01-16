import swinisLogo from "@/public/swinis.png";
import Image from "next/image";

export default function Page() {

    
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-500">
      <div className="bg-white">
        <div className="bg-[url('/banner.png')] p-4 text-8xl">
          {/* <Image src={banner} alt="Background Pattern" className="absolute left-0 top-0 -z-10" /> */}
          <div className="flex items-baseline gap-20">
            <div className="font-msMadi font-bold">Ramadan</div>
            <Image
              src={swinisLogo}
              alt="Swinburne Islamic Society Logo"
              className="w-52"
            />
          </div>
          <div className="font-bodoniModa">SPONSORSHIP</div>
        </div>

        <div className="grid grid-cols-3 gap-8 p-4">
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col items-center pt-16">
            <div className="absolute top-[0] h-32 w-32 rounded-full bg-red-400"></div>
            <div className="flex w-48 flex-col items-center gap-2 rounded-xl bg-[#ced3d7] p-2 pt-20 text-center">
              <span className="font-bold">SPONSOR A WHOLE WEEK</span>
              <span className="text-2xl font-bold">$100</span>
              <span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos,
                minima?
              </span>
              <button className="rounded-full bg-[#144560] p-3 text-xl text-white">
                Donate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
