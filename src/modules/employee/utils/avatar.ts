// Helpers for the Address Book avatars. Single brand accent — clean, not flashy.

export const getInitials = (name?: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Shared design tokens used across the Address Book.
export const BRAND = "#1775BB";
export const BRAND_SOFT = "#EFF5FB";
export const INK = "#101828";
export const MUTED = "#667085";
export const LINE = "#EDF0F4";
export const LINE_SOFT = "#F2F4F7";

// Tasteful per-person colours: a light tint (bg), a readable solid (fg), and a
// lighter tone (from) used to build a vibrant avatar gradient.
export type AvatarColor = { bg: string; fg: string; from: string };

const AVATAR_COLORS: AvatarColor[] = [
  { bg: "#EAF2FB", fg: "#1D6FB8", from: "#2B8AD6" }, // blue
  { bg: "#E9F7EF", fg: "#1E8E5A", from: "#27A06A" }, // green
  { bg: "#FDEEE7", fg: "#C2541E", from: "#DB6A2C" }, // orange
  { bg: "#F0EBFB", fg: "#6C45C2", from: "#7E57D6" }, // violet
  { bg: "#FCEBF2", fg: "#C2457E", from: "#D65A93" }, // pink
  { bg: "#E7F6F8", fg: "#1A8BA0", from: "#1FA0B8" }, // teal
  { bg: "#FBF3E2", fg: "#A87A12", from: "#C89A2A" }, // amber
  { bg: "#EEF1F6", fg: "#475467", from: "#5A6678" }, // slate
];

export const getAvatarColor = (key?: string): AvatarColor => {
  const s = key || "";
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Vibrant avatar gradient from a person's colour.
export const avatarGradient = (c: AvatarColor, deg = 135) =>
  `linear-gradient(${deg}deg, ${c.from}, ${c.fg})`;

// Brand gradient for primary accents (title icon, primary button).
export const BRAND_GRADIENT = "linear-gradient(135deg, #2B8AD6, #1775BB)";
