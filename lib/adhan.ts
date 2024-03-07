//--------------------- Copyright Block ----------------------
/*

index.ts: Prayer Times Calculator (ver 2.3)
Copyright (C) 2007-2011 PrayTimes.org

Developer: Hamid Zarrabi-Zadeh
License: GNU LGPL v3.0

TERMS OF USE:
	Permission is granted to use this code, with or
	without modification, in any website or application
	provided that credit is given to the original work
	with a link back to PrayTimes.org.

This program is distributed in the hope that it will
be useful, but WITHOUT ANY WARRANTY.

PLEASE DO NOT REMOVE THIS COPYRIGHT BLOCK.

*/

//--------------------- Help and Manual ----------------------
/*

User's Manual:
http://praytimes.org/manual

Calculation Formulas:
http://praytimes.org/calculation



//------------------------ User Interface -------------------------


	getTimes (date, coordinates [, timeZone [, dst [, timeFormat]]])

	setMethod (method)       // set calculation method
	adjust (parameters)      // adjust calculation parameters
	tune (offsets)           // tune times by given offsets

	getMethod ()             // get calculation method
	getSetting ()            // get current calculation parameters
	getOffsets ()            // get current time offsets


//------------------------- Sample Usage --------------------------


	var PT = new PrayTimes('ISNA');
	var times = PT.getTimes(new Date(), [43, -80], -5);
	document.write('Sunrise = '+ times.sunrise)


*/

/* Types */

// Adjust Methods for Higher Latitudes
type HighLatMethods =
  | "NightMiddle" // middle of night
  | "AngleBased" // angle/60th of night
  | "OneSeventh" // 1/7th of night
  | "None"; // No adjustment

type Setting = {
  imsak: string | number;
  fajr: number;
  dhuhr: string;
  asr: AsrJuristics | number;
  maghrib: number | string;
  isha: number | string;
  midnight: MidnightMethods;
  highLats: HighLatMethods;
};

// Asr Juristic Methods
type AsrJuristics =
  | "Standard" // Shafi`i, Maliki, Ja`fari, Hanbali
  | "Hanafi"; // Hanafi

type InputDate = Date | InputDateTuple;

type InputDateTuple = [number, number, number];

type Coordinates = [number, number, number?];

type TimeZone = "auto" | number;

type DateIsDST = number | "auto";

type TimeFormats =
  | "24h" // 24-hour format
  | "12h" // 12-hour format
  | "12hNS" // 12-hour format with no suffix
  | "Float"; // floating point number

type CalculationMethodsNames =
  | "MWL"
  | "ISNA"
  | "Egypt"
  | "Makkah"
  | "Karachi"
  | "Tehran"
  | "Jafari";

// Midnight Mode
type MidnightMethods =
  | "Standard" // Mid Sunset to Sunrise
  | "Jafari"; // Mid Sunset to Fajr

// type NumberOrString<T extends TimeFormats, U> = U extends number ? (T extends 'Float' ? number : string) : string

export type PrayerNames =
  | "imsak"
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "sunset"
  | "maghrib"
  | "isha"
  | "midnight";

export type PrayerTimes = NumberPrayerTimes | StringPrayerTimes;

export type NumberPrayerTimes = {
  [name in PrayerNames]: number;
};

type StringPrayerTimes = {
  [name in PrayerNames]: string;
};

type MidnightExcludedPrayerTimes = {
  [name in Exclude<PrayerNames, "midnight">]: number;
};

type CalculationMethods = {
  [name in CalculationMethodsNames]: {
    name: string;
    params: {
      fajr: number;
      isha: number | string;
      maghrib: number | string;
      midnight: MidnightMethods;
    };
  };
};

//----------------------- PrayTimes Class ------------------------
export class Adhan {
  //------------------------ Constants --------------------------
  // Time Names
  private static readonly timeNames = {
    imsak: "Imsak",
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    sunset: "Sunset",
    maghrib: "Maghrib",
    isha: "Isha",
    midnight: "Midnight",
  };

  // Calculation Methods
  private static readonly methods = {
    MWL: {
      name: "Muslim World League",
      params: { fajr: 18, isha: 17 },
    },
    ISNA: {
      name: "Islamic Society of North America (ISNA)",
      params: { fajr: 15, isha: 15 },
    },
    Egypt: {
      name: "Egyptian General Authority of Survey",
      params: { fajr: 19.5, isha: 17.5 },
    },
    Makkah: {
      name: "Umm Al-Qura University, Makkah",
      params: { fajr: 18.5, isha: "90 min" }, // fajr was 19 degrees before 1430 hijri
    },
    Karachi: {
      name: "University of Islamic Sciences, Karachi",
      params: { fajr: 18, isha: 18 },
    },
    Tehran: {
      name: "Institute of Geophysics, University of Tehran",
      params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: "Jafari" }, // isha is not explicitly specified in this method
    },
    Jafari: {
      name: "Shia Ithna-Ashari, Leva Institute, Qum",
      params: { fajr: 16, isha: 14, maghrib: 4, midnight: "Jafari" },
    },
  } as CalculationMethods;

  // Default Parameters in Calculation Methods
  private static readonly defaultParams = {
    maghrib: "0 min",
    midnight: "Standard" as MidnightMethods,
  };

  //---------------------- Default Settings --------------------

  private calcMethod: CalculationMethodsNames = "MWL";

  // do not change anything here; use adjust method instead
  private setting = {
    imsak: "10 min",
    dhuhr: "0 min",
    asr: "Standard",
    highLats: "NightMiddle",
  } as Setting;

  private timeFormat: TimeFormats = "24h";
  private readonly timeSuffixes: readonly [string, string] = ["am", "pm"];
  private readonly invalidTime = "-----";

  private numIterations = 1;
  private offset = {} as NumberPrayerTimes;

  //----------------------- Local Variables ---------------------

  lat: any;
  lng: any;
  elv!: number; // coordinates
  timeZone: any;
  jDate!: number; // time variables

  //---------------------- Initialization -----------------------
  constructor() {
    let method: CalculationMethodsNames | undefined = undefined;
    // set methods defaults
    const defParams = Adhan.defaultParams;
    for (const i in Adhan.methods) {
      const params = Adhan.methods[i as CalculationMethodsNames].params;
      let j: keyof typeof Adhan.defaultParams;
      for (j in defParams)
        if (typeof params[j] === "undefined")
          (params[j] as string) = defParams[j];
    }

    // initialize settings
    this.calcMethod = method || this.calcMethod;
    const params = Adhan.methods[this.calcMethod].params;
    let id: keyof typeof params;
    for (id in params) {
      (this.setting[id] as string | number) = params[id];
    }
    // init time offsets
    let i: keyof typeof Adhan.timeNames;
    for (i in Adhan.timeNames) this.offset[i] = 0;
  }

  //----------------------- Public Functions ------------------------

  // set calculation method
  setMethod(method: CalculationMethodsNames): void {
    if (Adhan.methods[method]) {
      this.adjust(Adhan.methods[method].params);
      this.calcMethod = method;
    }
  }

  // set calculating parameters
  adjust(params: Partial<Setting>): void {
    let id: keyof Setting;
    for (id in params)
      (this.setting[id] as number | string) = params[id] || this.setting[id];
  }

  // set time offsets
  tune(timeOffsets: Partial<NumberPrayerTimes>): void {
    let i: PrayerNames;
    for (i in timeOffsets) this.offset[i] = timeOffsets[i] || this.offset[i];
  }

  // get current calculation method
  getMethod() {
    return this.calcMethod;
  }

  // get current setting
  getSetting() {
    return this.setting;
  }

  // get current time offsets
  getOffsets() {
    return this.offset;
  }

  // get default calc parametrs
  getDefaults() {
    return Adhan.methods;
  }

  /**
   * Return prayer times for a given date
   * @param date - The date for which prayer times are calculated. You can use new Date() to specify today. Date can be also entered as a triple [year, month, day]. For example, [2009, 2, 26] specifies February 26, 2009.
   * @param coords - Specifies the coordinates of the input location as a triple [latitude, longitude, elevation]. Latitude is a real number between -90 and 90, longitude is between -180 and 180, and elevation is a positive number, specifying the height in meters with respect to the surrounding terrain. The elevation parameter is optional. Examples of valid coordinates are [-43.2, 80.6] and [12.5, -25.8, 300].
   * @param timezone - The difference to Greenwich time (GMT) in hours. If omitted or set to 'auto', timezone is extracted from the system.
   * @param dst - Daylight Saving Time: 1 if date is in daylight saving time, 0 otherwise. If omitted or set to 'auto', dst is extracted from the system.
   * @param format - Output time format, according to the following table:
   * | Format | Description                   | Example |
   * | :----- | :---------------------------- | :------ |
   * | 24h	| 24-hour time format	        | 16:45   |
   * | 12h	| 12-hour time format	        | 4:45 pm |
   * | 12hNS  | 12-hour format with no suffix | 4:45    |
   * | Float  | Floating point number	        | 16.75   |
   * @returns An associative array containing 9 prayer times (see {@link http://praytimes.org/wiki/Calculation here} for the list of times and their definition). Each time can be accessed thorough its name. For example, if the output of getTimes function is stored in an object `times`, the time for sunrise can be accessed through `times.sunrise`.
   */
  getTimes<T extends TimeFormats>(
    date: InputDate,
    coords: Coordinates,
    timezone?: TimeZone,
    dst?: DateIsDST,
    format?: T
  ): [T] extends ["Float"] ? NumberPrayerTimes : StringPrayerTimes;
  getTimes(
    date: InputDate,
    coords: Coordinates,
    timezone?: TimeZone,
    dst?: DateIsDST,
    format?: TimeFormats
  ): PrayerTimes {
    console.log({date, coords, timezone, dst, format})
    this.lat = coords[0];
    this.lng = coords[1];
    this.elv = coords[2] || 0;
    this.timeFormat = format || this.timeFormat;
    if (date instanceof Date)
      date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    if (typeof timezone === "undefined" || timezone === "auto")
      timezone = this.getTimeZone(date);
    if (typeof dst === "undefined" || dst === "auto") dst = this.getDst(date);
    this.timeZone = 1 * timezone + (1 * dst ? 1 : 0);
    this.jDate = this.julian(date[0], date[1], date[2]) - this.lng / (15 * 24);
    console.log("342")
    console.log(this.jDate)
    console.log(this.timeZone)
    console.log()
    return this.computeTimes();
  }

  /** convert float time to the given format (@see {@link TimeFormats}) */
  // private getFormattedTime<T extends TimeFormats, U>(time: U, format: T, suffixes?: readonly [string, string]): NumberOrString<T, U>
  private getFormattedTime(
    time: number,
    format: TimeFormats,
    suffixes?: readonly [string, string]
  ): number | string {
    if (isNaN(time)) return this.invalidTime;
    if (format == "Float") return time;
    suffixes = suffixes || this.timeSuffixes;

    time = DMath.fixHour(time + 0.5 / 60); // add 0.5 minutes to round
    var hours = Math.floor(time);
    var minutes = Math.floor((time - hours) * 60);
    var suffix = format == "12h" ? suffixes[hours < 12 ? 0 : 1] : "";
    var hour =
      format == "24h"
        ? this.twoDigitsFormat(hours)
        : ((hours + 12 - 1) % 12) + 1;
    return (
      hour + ":" + this.twoDigitsFormat(minutes) + (suffix ? " " + suffix : "")
    );
  }

  //---------------------- Calculation Functions -----------------------

  // compute mid-day time
  private midDay(time: number): number {
    var eqt = this.sunPosition(this.jDate + time).equation;
    var noon = DMath.fixHour(12 - eqt);
    return noon;
  }

  // compute the time at which sun reaches a specific angle below horizon
  private sunAngleTime(angle: number, time: any, direction?: string) {
    var decl = this.sunPosition(this.jDate + time).declination;
    var noon = this.midDay(time);
    var t =
      (1 / 15) *
      DMath.arccos(
        (-DMath.sin(angle) - DMath.sin(decl) * DMath.sin(this.lat)) /
          (DMath.cos(decl) * DMath.cos(this.lat))
      );
    return noon + (direction == "ccw" ? -t : t);
  }

  // compute asr time
  private asrTime(factor: number, time: number) {
    var decl = this.sunPosition(this.jDate + time).declination;
    var angle = -DMath.arccot(factor + DMath.tan(Math.abs(this.lat - decl)));
    return this.sunAngleTime(angle, time);
  }

  // compute declination angle of sun and equation of time
  // Ref: http://aa.usno.navy.mil/faq/docs/SunApprox.php
  private sunPosition(jd: number): { declination: number; equation: number } {
    var D = jd - 2451545.0;
    var g = DMath.fixAngle(357.529 + 0.98560028 * D);
    var q = DMath.fixAngle(280.459 + 0.98564736 * D);
    var L = DMath.fixAngle(q + 1.915 * DMath.sin(g) + 0.02 * DMath.sin(2 * g));

    var e = 23.439 - 0.00000036 * D;

    var RA = DMath.arctan2(DMath.cos(e) * DMath.sin(L), DMath.cos(L)) / 15;
    var eqt = q / 15 - DMath.fixHour(RA);
    var decl = DMath.arcsin(DMath.sin(e) * DMath.sin(L));

    return { declination: decl, equation: eqt };
  }

  // convert Gregorian date to Julian day
  // Ref: Astronomical Algorithms by Jean Meeus
  private julian(year: number, month: number, day: number): number {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    var A = Math.floor(year / 100);
    var B = 2 - A + Math.floor(A / 4);

    var JD =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      B -
      1524.5;
    return JD;
  }

  //---------------------- Compute Prayer Times -----------------------

  // compute prayer times at given julian date
  private computePrayerTimes(
    times: MidnightExcludedPrayerTimes
  ): MidnightExcludedPrayerTimes {
    times = this.dayPortion(times);
    var params = this.setting;

    var imsak = this.sunAngleTime(this.eval(params.imsak), times.imsak, "ccw");
    var fajr = this.sunAngleTime(this.eval(params.fajr), times.fajr, "ccw");
    var sunrise = this.sunAngleTime(this.riseSetAngle(), times.sunrise, "ccw");
    var dhuhr = this.midDay(times.dhuhr);
    var asr = this.asrTime(this.asrFactor(params.asr), times.asr);
    var sunset = this.sunAngleTime(this.riseSetAngle(), times.sunset);
    var maghrib = this.sunAngleTime(this.eval(params.maghrib), times.maghrib);
    var isha = this.sunAngleTime(this.eval(params.isha), times.isha);

    return {
      imsak: imsak,
      fajr: fajr,
      sunrise: sunrise,
      dhuhr: dhuhr,
      asr: asr,
      sunset: sunset,
      maghrib: maghrib,
      isha: isha,
    };
  }

  // compute prayer times
  private computeTimes(): PrayerTimes {
    // default times
    var times: MidnightExcludedPrayerTimes | NumberPrayerTimes = {
      imsak: 5,
      fajr: 5,
      sunrise: 6,
      dhuhr: 12,
      asr: 13,
      sunset: 18,
      maghrib: 18,
      isha: 18,
    };

    // main iterations
    for (var i = 1; i <= this.numIterations; i++)
      times = this.computePrayerTimes(times);

    times = this.adjustTimes(times);

    // add midnight time
    (times as NumberPrayerTimes).midnight =
      this.setting.midnight == "Jafari"
        ? times.sunset + this.timeDiff(times.sunset, times.fajr) / 2
        : times.sunset + this.timeDiff(times.sunset, times.sunrise) / 2;

    times = this.tuneTimes(times as NumberPrayerTimes);
    console.log("492")
    console.log({times})
    console.log()
    return this.modifyFormats(times as NumberPrayerTimes);
  }

  // adjust times
  private adjustTimes(
    times: MidnightExcludedPrayerTimes
  ): MidnightExcludedPrayerTimes {
    var params = this.setting;
    let i: keyof MidnightExcludedPrayerTimes;
    for (i in times) times[i] += this.timeZone - this.lng / 15;

    if (params.highLats != "None") times = this.adjustHighLats(times);

    if (this.isMin(params.imsak))
      times.imsak = times.fajr - this.eval(params.imsak) / 60;
    if (this.isMin(params.maghrib))
      times.maghrib = times.sunset + this.eval(params.maghrib) / 60;
    if (this.isMin(params.isha))
      times.isha = times.maghrib + this.eval(params.isha) / 60;
    times.dhuhr += this.eval(params.dhuhr) / 60;

    return times;
  }

  // get asr shadow factor
  private asrFactor(asrParam: Setting["asr"]) {
    var factor = { Standard: 1, Hanafi: 2 }[asrParam];
    return factor || this.eval(asrParam);
  }

  // return sun angle for sunset/sunrise
  private riseSetAngle(): number {
    //var earthRad = 6371009; // in meters
    //var angle = DMath.arccos(earthRad/(earthRad+ elv));
    var angle = 0.0347 * Math.sqrt(this.elv); // an approximation
    return 0.833 + angle;
  }

  // apply offsets to the times
  private tuneTimes(times: NumberPrayerTimes): NumberPrayerTimes {
    let i: PrayerNames;
    for (i in times) times[i] += this.offset[i] / 60;
    return times;
  }

  // convert times to given time format
  private modifyFormats(times: NumberPrayerTimes): PrayerTimes {
    let i: PrayerNames;
    for (i in times)
      (times as PrayerTimes)[i] = this.getFormattedTime(
        times[i],
        this.timeFormat
      );
      console.log("548")
      console.log({times})
      console.log()
    return times;
  }

  // adjust times for locations in higher latitudes
  private adjustHighLats(
    times: MidnightExcludedPrayerTimes
  ): MidnightExcludedPrayerTimes {
    var params = this.setting;
    var nightTime = this.timeDiff(times.sunset, times.sunrise);

    times.imsak = this.adjustHLTime(
      times.imsak,
      times.sunrise,
      this.eval(params.imsak),
      nightTime,
      "ccw"
    );
    times.fajr = this.adjustHLTime(
      times.fajr,
      times.sunrise,
      this.eval(params.fajr),
      nightTime,
      "ccw"
    );
    times.isha = this.adjustHLTime(
      times.isha,
      times.sunset,
      this.eval(params.isha),
      nightTime
    );
    times.maghrib = this.adjustHLTime(
      times.maghrib,
      times.sunset,
      this.eval(params.maghrib),
      nightTime
    );

    return times;
  }

  // adjust a time for higher latitudes
  private adjustHLTime(
    time: number,
    base: number,
    angle: number,
    night: number,
    direction?: string
  ) {
    var portion = this.nightPortion(angle, night);
    var timeDiff =
      direction == "ccw"
        ? this.timeDiff(time, base)
        : this.timeDiff(base, time);
    if (isNaN(time) || timeDiff > portion)
      time = base + (direction == "ccw" ? -portion : portion);
    return time;
  }

  // the night portion used for adjusting times in higher latitudes
  private nightPortion(angle: number, night: number): number {
    var method = this.setting.highLats;
    var portion = 1 / 2; // MidNight
    if (method == "AngleBased") portion = (1 / 60) * angle;
    if (method == "OneSeventh") portion = 1 / 7;
    return portion * night;
  }

  // convert hours to day portions
  private dayPortion(
    times: MidnightExcludedPrayerTimes
  ): MidnightExcludedPrayerTimes {
    let i: keyof MidnightExcludedPrayerTimes;
    for (i in times) times[i] /= 24;
    return times;
  }

  //---------------------- Time Zone Functions -----------------------

  // get local time zone
  private getTimeZone(date: InputDateTuple): number {
    const year = date[0];
    const t1 = this.gmtOffset([year, 0, 1]);
    const t2 = this.gmtOffset([year, 6, 1]);
    return Math.min(t1, t2);
  }

  // get daylight saving for a given date
  private getDst(date: InputDateTuple): number {
    return this.gmtOffset(date) != this.getTimeZone(date) ? 1 : 0;
  }

  // GMT offset for a given date
  private gmtOffset(date: InputDateTuple): number {
    return (
      new Date(date[0], date[1] - 1, date[2], 12).getTimezoneOffset() / -60
    );
  }

  //---------------------- Misc Functions -----------------------

  // convert given string into a number
  private eval(str: unknown): number {
    return +(str + "").split(/[^0-9.+-]/)[0];
  }

  // detect if input contains 'min'
  private isMin(arg: string | number) {
    return (arg + "").indexOf("min") != -1;
  }

  // compute the difference between two times
  private timeDiff(time1: number, time2: number) {
    return DMath.fixHour(time2 - time1);
  }

  // add a leading 0 if necessary
  private twoDigitsFormat(num: number): string {
    return (num < 10 ? "0" : "") + num;
  }
}

//---------------------- Degree-Based Math Class -----------------------

var DMath = {
  dtr(d: number): number {
    return (d * Math.PI) / 180.0;
  },
  rtd(r: number): number {
    return (r * 180.0) / Math.PI;
  },

  sin(d: number): number {
    return Math.sin(this.dtr(d));
  },
  cos(d: number): number {
    return Math.cos(this.dtr(d));
  },
  tan(d: number): number {
    return Math.tan(this.dtr(d));
  },

  arcsin(d: number): number {
    return this.rtd(Math.asin(d));
  },
  arccos(d: number): number {
    return this.rtd(Math.acos(d));
  },
  arctan(d: number): number {
    return this.rtd(Math.atan(d));
  },

  arccot(x: number): number {
    return this.rtd(Math.atan(1 / x));
  },
  arctan2(y: number, x: number): number {
    return this.rtd(Math.atan2(y, x));
  },

  fixAngle(a: number): number {
    return this.fix(a, 360);
  },
  fixHour(a: number): number {
    return this.fix(a, 24);
  },

  fix(a: number, b: number): number {
    a = a - b * Math.floor(a / b);
    return a < 0 ? a + b : a;
  },
};
