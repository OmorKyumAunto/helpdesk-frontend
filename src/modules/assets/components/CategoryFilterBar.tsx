import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AppstoreOutlined,
  ApiOutlined,
  CameraOutlined,
  ClockCircleOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  DeploymentUnitOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  LaptopOutlined,
  LeftOutlined,
  PlaySquareOutlined,
  PrinterOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  ScanOutlined,
  ShareAltOutlined,
  SoundOutlined,
  TabletOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  VideoCameraOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { TOP_STOCK_CATEGORIES } from "../utils/assetCategories";

/** One glyph per canonical category — keeps the rail scannable at a glance. */
const CATEGORY_ICON: Record<string, React.ReactNode> = {
  Laptop: <LaptopOutlined />,
  Desktop: <DesktopOutlined />,
  Monitor: <PlaySquareOutlined />,
  Printer: <PrinterOutlined />,
  Accessories: <ToolOutlined />,
  TV: <DesktopOutlined />,
  "Ipad/Tab": <TabletOutlined />,
  Projector: <FundProjectionScreenOutlined />,
  "Attendence Machine": <ClockCircleOutlined />,
  Speaker: <SoundOutlined />,
  Scanner: <ScanOutlined />,
  Camera: <CameraOutlined />,
  "NVR/DVR": <VideoCameraOutlined />,
  "Online/Industrial UPS": <ThunderboltOutlined />,
  "Conference System": <TeamOutlined />,
  Firewall: <SafetyCertificateOutlined />,
  "Core Router": <GlobalOutlined />,
  "Access Point": <WifiOutlined />,
  Server: <CloudServerOutlined />,
  "Network Rack": <DatabaseOutlined />,
  "24 Port Switch Managable": <ClusterOutlined />,
  "48 Port Switch Managable": <DeploymentUnitOutlined />,
  "Non Managable Switch": <ShareAltOutlined />,
};

const fallbackIcon = <ApiOutlined />;

type TProps = {
  /** Currently selected category, or undefined for "All". */
  value?: string;
  /** Fired with the new category, or undefined when "All" is chosen. */
  onChange: (category?: string) => void;
  /** The handful of high-volume categories promoted to chips. */
  categories?: string[];
};

/**
 * One-click shortcuts for the categories that carry most of the volume. The
 * long tail stays in the toolbar's "Select Category" dropdown; when something
 * from there is picked, it is appended to the rail as an extra chip so the
 * active filter is always visible in one place.
 *
 * Motion notes — both matter for keeping this smooth on a 3000-row table:
 *  1. The selection pill is ONE absolutely-positioned element moved with a
 *     `transform`, measured from the active chip's offset box. It is not a
 *     shared-layout animation: nothing re-measures every frame, and the browser
 *     can run the whole thing on the compositor.
 *  2. `selected` is local state so the pill moves on the very next frame after
 *     a click. The parent's real filter update (which refetches and re-renders
 *     the table) is a React transition, so it can no longer block the slide.
 */
const CategoryFilterBar = ({
  value,
  onChange,
  categories = TOP_STOCK_CATEGORIES,
}: TProps) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ left: false, right: false });

  // Optimistic selection — see note 2 above.
  const [selected, setSelected] = useState<string | undefined>(value);
  useEffect(() => setSelected(value), [value]);

  const [pill, setPill] = useState({ x: 0, w: 0, shown: false });
  // Suppresses the slide on the very first paint so the pill doesn't fly in
  // from the left edge when the page loads with a filter already applied.
  // State rather than a ref on purpose: clearing it has to produce its own
  // committed render, otherwise the browser never sees a painted frame with
  // transitions enabled and the first click would jump instead of slide.
  const [settled, setSettled] = useState(false);

  // Arrow visibility is derived from live scroll geometry, not from a guess at
  // how many chips fit — the rail width changes with the sidebar and viewport.
  const syncOverflow = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflow({
      left: el.scrollLeft > 2,
      right: max > 2 && el.scrollLeft < max - 2,
    });
  }, []);

  const measurePill = useCallback(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>(".cat-chip--on");
    if (!rail || !active) {
      setPill((p) => ({ ...p, shown: false }));
      return;
    }
    // offsetLeft is in the rail's own content box (it is position:relative), so
    // this stays correct while the rail is scrolled.
    setPill({ x: active.offsetLeft, w: active.offsetWidth, shown: true });
  }, []);

  useLayoutEffect(() => {
    measurePill();
  }, [measurePill, selected, categories]);

  // One frame after mount, allow the pill to animate.
  useEffect(() => {
    const id = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onResize = () => {
      syncOverflow();
      measurePill();
    };
    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(el);
    // Web-font swap changes chip widths without changing the rail's box.
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => observer.disconnect();
  }, [syncOverflow, measurePill, categories]);

  const scrollBy = (direction: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.round(el.clientWidth * 0.7),
      behavior: "smooth",
    });
  };

  // Keep the selected chip visible when the filter is set from the dropdown.
  useEffect(() => {
    const active = railRef.current?.querySelector<HTMLElement>(".cat-chip--on");
    active?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [selected]);

  const pick = (key: string | undefined, isOn: boolean) => {
    const next = isOn ? undefined : key;
    setSelected(next); // urgent: pill moves now
    onChange(next); // deferred by the parent: table catches up
  };

  const chip = (
    label: string,
    key: string | undefined,
    icon: React.ReactNode,
    index: number
  ) => {
    const on = selected === key;
    return (
      <button
        key={key ?? "__all"}
        type="button"
        className={`cat-chip${on ? " cat-chip--on" : ""}`}
        aria-pressed={on}
        title={label}
        // Drives the staggered entrance delay in CSS.
        style={{ ["--i" as any]: index }}
        onClick={() => pick(key, on)}
      >
        <span className="cat-chip__icon">{icon}</span>
        <span className="cat-chip__label">{label}</span>
      </button>
    );
  };


  return (
    <div className="cat-bar">
      <button
        type="button"
        className={`cat-nav cat-nav--left${overflow.left ? " cat-nav--show" : ""}`}
        aria-label="Scroll categories left"
        tabIndex={overflow.left ? 0 : -1}
        onClick={() => scrollBy(-1)}
      >
        <LeftOutlined />
      </button>

      <div
        className="cat-shell"
        ref={railRef}
        onScroll={syncOverflow}
        role="group"
        aria-label="Filter by category"
      >
        {/* The single travelling selection pill. */}
        <span
          aria-hidden="true"
          className={`cat-pill${pill.shown ? " cat-pill--shown" : ""}${
            settled ? "" : " cat-pill--init"
          }`}
          style={{
            width: pill.w,
            transform: `translate3d(${pill.x}px,0,0)`,
          }}
        />

        {chip("All", undefined, <AppstoreOutlined />, 0)}
        <span className="cat-sep" aria-hidden="true" />
        {categories.map((c, i) =>
          chip(c, c, CATEGORY_ICON[c] ?? fallbackIcon, i + 1)
        )}

        {/* Selection made from the dropdown's full list — surfaced here too. */}
        {selected && !categories.includes(selected) && (
          <>
            <span className="cat-sep" aria-hidden="true" />
            {chip(
              selected,
              selected,
              CATEGORY_ICON[selected] ?? fallbackIcon,
              categories.length + 1
            )}
          </>
        )}
      </div>

      <button
        type="button"
        className={`cat-nav cat-nav--right${overflow.right ? " cat-nav--show" : ""}`}
        aria-label="Scroll categories right"
        tabIndex={overflow.right ? 0 : -1}
        onClick={() => scrollBy(1)}
      >
        <RightOutlined />
      </button>

    </div>
  );
};

export default CategoryFilterBar;
