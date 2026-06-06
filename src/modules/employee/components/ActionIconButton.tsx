import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";

type Tone = "blue" | "red" | "amber" | "green" | "violet";

const TONES: Record<Tone, { bg: string; fg: string; hover: string }> = {
  blue: { bg: "#EFF5FB", fg: "#1775BB", hover: "#DCEBF8" },
  red: { bg: "#FEF2F2", fg: "#DC2626", hover: "#FCE2E2" },
  amber: { bg: "#FBF3E2", fg: "#A87A12", hover: "#F5E8C7" },
  green: { bg: "#ECFDF3", fg: "#067647", hover: "#D6F5E2" },
  violet: { bg: "#F0EBFB", fg: "#6C45C2", hover: "#E4DAF6" },
};

type Props = {
  icon: ReactNode;
  title: string;
  tone?: Tone;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// Polished, colourful, animated icon button used across the Address Book actions.
const ActionIconButton = forwardRef<HTMLButtonElement, Props>(
  ({ icon, title, tone = "blue", onClick, ...rest }, ref) => {
    const t = TONES[tone];
    return (
      <Tooltip title={title}>
        <motion.button
          ref={ref}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          whileHover={{ scale: 1.1, backgroundColor: t.hover }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            background: t.bg,
            color: t.fg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            padding: 0,
          }}
          {...rest}
        >
          {icon}
        </motion.button>
      </Tooltip>
    );
  }
);

ActionIconButton.displayName = "ActionIconButton";

export default ActionIconButton;
