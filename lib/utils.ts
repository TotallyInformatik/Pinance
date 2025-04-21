import assert from "assert";
import { clsx, type ClassValue } from "clsx"
import { Replace } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DEFAULT_CURRENCY = "EUR";

export const CURRENCIES: readonly [string, ...string[]] = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
  "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
  "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
  "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
  "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
  "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
  "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
  "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
  "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
  "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
  "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
  "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
  "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SOS", "SRD", "SSP",
  "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD",
  "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND",
  "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW", "ZWL"
];

const CURRENCY_TO_SYMBOLS: Record<string, string> = {
  AED: "د.إ", AFN: "؋", ALL: "L", AMD: "֏", ANG: "ƒ", AOA: "Kz", ARS: "$",
  AUD: "$", AWG: "ƒ", AZN: "₼", BAM: "KM", BBD: "$", BDT: "৳", BGN: "лв",
  BHD: ".د.ب", BIF: "FBu", BMD: "$", BND: "$", BOB: "Bs.", BRL: "R$",
  BSD: "$", BTN: "Nu.", BWP: "P", BYN: "Br", BZD: "$", CAD: "$", CDF: "FC",
  CHF: "CHF", CLP: "$", CNY: "¥", COP: "$", CRC: "₡", CUP: "$", CVE: "$",
  CZK: "Kč", DJF: "Fdj", DKK: "kr", DOP: "$", DZD: "دج", EGP: "£",
  ERN: "Nfk", ETB: "Br", EUR: "€", FJD: "$", FKP: "£", FOK: "kr", GBP: "£",
  GEL: "₾", GGP: "£", GHS: "₵", GIP: "£", GMD: "D", GNF: "FG", GTQ: "Q",
  GYD: "$", HKD: "$", HNL: "L", HRK: "kn", HTG: "G", HUF: "Ft", IDR: "Rp",
  ILS: "₪", IMP: "£", INR: "₹", IQD: "ع.د", IRR: "﷼", ISK: "kr", JEP: "£",
  JMD: "$", JOD: "د.ا", JPY: "¥", KES: "KSh", KGS: "с", KHR: "៛", KID: "$",
  KMF: "CF", KRW: "₩", KWD: "د.ك", KYD: "$", KZT: "₸", LAK: "₭", LBP: "ل.ل",
  LKR: "Rs", LRD: "$", LSL: "L", LYD: "ل.د", MAD: "د.م.", MDL: "L",
  MGA: "Ar", MKD: "ден", MMK: "K", MNT: "₮", MOP: "P", MRU: "UM",
  MUR: "₨", MVR: "Rf", MWK: "MK", MXN: "$", MYR: "RM", MZN: "MT",
  NAD: "$", NGN: "₦", NIO: "C$", NOK: "kr", NPR: "₨", NZD: "$", OMR: "﷼",
  PAB: "B/.", PEN: "S/", PGK: "K", PHP: "₱", PKR: "₨", PLN: "zł", PYG: "₲",
  QAR: "﷼", RON: "lei", RSD: "дин", RUB: "₽", RWF: "RF", SAR: "﷼",
  SBD: "$", SCR: "₨", SDG: "£", SEK: "kr", SGD: "$", SHP: "£", SLE: "Le",
  SOS: "Sh", SRD: "$", SSP: "£", STN: "Db", SYP: "£", SZL: "L", THB: "฿",
  TJS: "ЅМ", TMT: "m", TND: "د.ت", TOP: "T$", TRY: "₺", TTD: "$",
  TVD: "$", TWD: "NT$", TZS: "Sh", UAH: "₴", UGX: "USh", USD: "$",
  UYU: "$", UZS: "so'm", VES: "Bs.S", VND: "₫", VUV: "VT", WST: "T",
  XAF: "FCFA", XCD: "$", XOF: "CFA", XPF: "₣", YER: "﷼", ZAR: "R",
  ZMW: "ZK", ZWL: "$"
};

export function pad0(n: string) {
  return n.padStart(2, "0");
}



export function convertToISO8601(date: string) {
  try {

    const parts = date.split(".")
    
    assert(parts.length == 3)

    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const y = parseInt(parts[2]);

    const dateObject = new Date(y, m-1, d, 10, 0, 0);
    const ISO8601 = dateObject.toISOString().replace("Z", "").split("T").join(" ");
    
    return ISO8601;

  } catch {
    return ""
  }
}

export function convertToDate(iso: string) {
  const isoparts = iso.split(" ").join("T") + "Z"
  return new Date(isoparts);
}

export function getCurrencySymbol(code: string): string {
  return CURRENCY_TO_SYMBOLS[code] ?? code;
}

export function getMonthName(monthIndex: number): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error("Month index must be between 0 and 11.");
  }

  return months[monthIndex];
}

export function getMonthAbbreviation(monthIndex: number): string {
  const months = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
    "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
  ];

  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error("Month index must be between 0 and 11.");
  }

  return months[monthIndex];
}


export function mod(x: number, n: number) {
  return ((x % n) + n) % n;
}