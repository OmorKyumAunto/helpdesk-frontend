/**
 * One coordinated chart palette for the whole dashboard.
 *
 * Every colour here was validated with the data-viz palette validator against
 * the white chart surface (#ffffff) — not eyeballed. The old charts each used
 * their own ad-hoc set (#FF0000, #0088FE, #ba45ba, #4682B4 …) with no
 * colour-blind checking; a red/green ticket donut in particular was invisible
 * to deutan viewers (ΔE 2.0). These sets clear the CVD floors.
 *
 * Categorical assignment is BY FIXED ORDER, never cycled.
 */

// Chart chrome — recessive axes/grid, ink for text (never the series colour).
export const CHART_INK = {
  primary: "#0f172a",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e8ecf2",
  axis: "#c3c2b7",
  surface: "#ffffff",
};

/**
 * Ticket status donut. Validated all-pairs (worst CVD ΔE 6.9, warn band — legal
 * because the donut carries a legend + direct labels). Mapped so the colour
 * reinforces meaning: active=blue, handed-off=amber, done=teal, stuck=red.
 */
export const TICKET_COLORS = {
  "In Progress": "#2563eb",
  Forward: "#eda100",
  Solved: "#1baf7a",
  Unsolved: "#e34948",
} as const;

/**
 * Asset-category donut, up to 5 slices. Validated on the adjacent pairlist
 * (worst CVD ΔE 9.1); the sub-3:1 slots are relieved by the direct labels the
 * donut renders.
 */
export const CATEGORY_COLORS = [
  "#2563eb", // blue
  "#eb6834", // orange
  "#1baf7a", // teal
  "#eda100", // amber
  "#e87ba4", // magenta
];

// Two-series bar chart (stock vs disbursement). Validated all-pairs, both ≥3:1.
export const SERIES_BLUE = "#2563eb";
export const SERIES_GREEN = "#16a34a";

// Single-series magnitude bars (blood group). One hue — no CVD concern.
export const SINGLE_HUE = "#2563eb";
