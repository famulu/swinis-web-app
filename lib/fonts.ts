import {
  Bodoni_Moda,
  EB_Garamond,
  Ms_Madi,
  Open_Sans,
  Signika,
  Yeseva_One,
} from "next/font/google";

export const yesevaOne = Yeseva_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-yeseva-one",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const signika = Signika({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-signika",
});

export const garamond = EB_Garamond({
  weight: "500",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

export const msMadi = Ms_Madi({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ms-madi",
});

export const bodoniModa = Bodoni_Moda({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni-moda",
});
