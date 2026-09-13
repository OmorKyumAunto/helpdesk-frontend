import { useEffect } from "react";

/**
 * Global fit-to-width scaling.
 *
 * The UI is authored at desktop pixel sizes (tables ~1500px of columns, stat
 * tiles, toolbars). On a 1366x768 or a 1920x1080-at-125% laptop there simply
 * aren't enough CSS pixels, so wide tables start scrolling horizontally and
 * cards get cramped — a different layout from the one everything was designed
 * against.
 *
 * Instead of re-tuning every page for narrow viewports, the whole document is
 * zoomed out just enough to expose DESIGN_WIDTH CSS pixels. Layout then stays
 * pixel-identical to a large monitor at every desktop size; it is only drawn
 * smaller. This is the same thing as pressing Ctrl+- , applied automatically
 * and re-applied on resize.
 *
 * `zoom` is used rather than `transform: scale()` on purpose: transforms break
 * position:fixed/sticky and put antd's body-level popups (dropdowns, pickers,
 * tooltips) at the wrong offset. `zoom` keeps layout and hit-testing correct.
 */

/**
 * Viewport width the UI is written for — the "big screen" look.
 *
 * Measured, not guessed: the sidebar is a fixed 240px, and it occupies 13.8%
 * of the reference screenshots, so that monitor exposes ~1735 CSS px. 1720
 * matches it while still resolving to scale 1.0 there (no zoom on the screen
 * the UI already looks right on).
 */
const DESIGN_WIDTH = 1720;

/** Never shrink past this; below it text stops being comfortably readable. */
const MIN_SCALE = 0.72;

/**
 * Below this real width the app keeps its existing responsive behaviour
 * (drawer navigation, mobile card lists) instead of being scaled.
 */
const MIN_WIDTH_TO_SCALE = 1024;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const applyScale = () => {
  const root = document.documentElement;
  const width = window.innerWidth;

  const scale =
    width < MIN_WIDTH_TO_SCALE
      ? 1
      : clamp(width / DESIGN_WIDTH, MIN_SCALE, 1);

  // `zoom` is not in CSSStyleDeclaration's typings in every TS lib version.
  (root.style as unknown as Record<string, string>).zoom = String(scale);
  root.style.setProperty("--app-scale", String(scale));

  // Viewport units resolve against the unzoomed viewport, so `100vh` inside a
  // zoomed document does not cover the screen. --app-vh is the real screen
  // height expressed in the zoomed coordinate space; use it wherever a
  // full-height shell element is needed (see AppLayout's Sider).
  root.style.setProperty("--app-vh", `${window.innerHeight / scale}px`);
};

/**
 * Applies the scale on mount and keeps it in sync with viewport changes.
 * Mounted once, at the app root.
 */
export default function useAppScale() {
  useEffect(() => {
    applyScale();

    window.addEventListener("resize", applyScale);
    window.addEventListener("orientationchange", applyScale);

    return () => {
      window.removeEventListener("resize", applyScale);
      window.removeEventListener("orientationchange", applyScale);
    };
  }, []);
}
