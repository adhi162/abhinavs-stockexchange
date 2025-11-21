import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RGB = {
  r: number;
  g: number;
  b: number;
};

const clampColor = (value: number) => Math.max(0, Math.min(255, value));

const hexToRgb = (value: string): RGB | null => {
  const hex = value.replace("#", "").trim();
  if (!(hex.length === 3 || hex.length === 6)) return null;

  const normalized = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  const intValue = parseInt(normalized, 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };
};

const hslToRgb = (value: string): RGB | null => {
  const match = value
    .replace(/hsl|\(|\)|%/g, "")
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (match.length < 3) return null;

  const h = ((parseFloat(match[0]) % 360) + 360) % 360;
  const s = Math.min(Math.max(parseFloat(match[1]) / 100, 0), 1);
  const l = Math.min(Math.max(parseFloat(match[2]) / 100, 0), 1);

  if (Number.isNaN(h) || Number.isNaN(s) || Number.isNaN(l)) return null;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: clampColor(Math.round((r + m) * 255)),
    g: clampColor(Math.round((g + m) * 255)),
    b: clampColor(Math.round((b + m) * 255))
  };
};

const parseColor = (value: string): RGB | null => {
  if (!value) return null;
  const color = value.trim().toLowerCase();
  if (color.startsWith("#")) return hexToRgb(color);
  if (color.startsWith("hsl")) return hslToRgb(color);
  return null;
};

const getLuminance = ({ r, g, b }: RGB) => {
  const normalize = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLin = normalize(r);
  const gLin = normalize(g);
  const bLin = normalize(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

export const getReadableTextColor = (
  backgroundColor: string,
  lightText = "#0f172a",
  darkText = "#ffffff"
) => {
  const rgb = parseColor(backgroundColor);
  if (!rgb) return lightText;

  const luminance = getLuminance(rgb);
  return luminance > 0.55 ? lightText : darkText;
};
