import { Open_Sans } from "next/font/google";
import { Yeseva_One } from "next/font/google";

export const yesevaOne = Yeseva_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-yeseva-one",
});

export const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-open-sans',
  display: "swap",
});
