import React, { useEffect, useMemo, useState } from "react";
import { Badge, Grid, Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkle, ChatCircleDots, Lifebuoy } from "@phosphor-icons/react";
import AIChatBox from "./AIChatBox";
import TicketChatBox from "./TicketChatBox";
import { useGetMeQuery } from "../../app/api/userApi";



const { useBreakpoint } = Grid;


const HIDE_ON = [
  "/login",
  "/register",
  "/unauthorized",
  "/forget-password",
  "/forget-password/otp",
  "/reset-password",
];

const OPEN_TICKETS_PATH = "/tickets/list";

type BoxType = "ai" | "ticket" | null;

export default function AIAssistantDock() {
  const { xs } = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: meRes } = useGetMeQuery();

  const employeeIdFromApi = meRes?.data?.employee_id;
  const userId: string | null = employeeIdFromApi ?? localStorage.getItem("dbl_employee_id");
  const roleId = meRes?.data?.role_id;
  const canUseTicketAI = roleId === 3;



  const hideByRoute = useMemo(
    () => HIDE_ON.some((p) => location.pathname.startsWith(p)),
    [location.pathname]
  );

  const hideDock = xs || hideByRoute;

  const [hovered, setHovered] = useState(false);
  const [unread, setUnread] = useState(true);
  const [openBox, setOpenBox] = useState<BoxType>(null);
  const [minimized, setMinimized] = useState(false);

  const spring: Transition = { type: "spring", stiffness: 520, damping: 34 };

  const suggestions = useMemo(
    () => [
      "Ask about anything",
      "Draft a ticket in less than 10s",
      "Get ideas for Reports",
      "Get help for troubleshooting",
    ],
    []
  );
  const [sIdx, setSIdx] = useState(0);
  useEffect(() => {
    if (employeeIdFromApi) localStorage.setItem("dbl_employee_id", employeeIdFromApi);
  }, [employeeIdFromApi]);

  useEffect(() => {
    if (!canUseTicketAI && openBox === "ticket") {
      setOpenBox(null);
      setMinimized(false);
    }
  }, [canUseTicketAI, openBox]);
  const actionsCount = canUseTicketAI ? 2 : 1;
  const hoveredWidth = actionsCount === 2 ? 340 : 300; // tweak if you want
  const idleWidth = actionsCount === 2 ? 260 : 240;    // tweak if you want



  useEffect(() => {
    if (openBox || minimized || hideDock) return;
    const t = setInterval(() => setSIdx((p) => (p + 1) % suggestions.length), 2600);
    return () => clearInterval(t);
  }, [openBox, minimized, hideDock, suggestions.length]);

  const dockVisible = !hideDock && !openBox && !minimized;

  const activeMinLabel = openBox === "ticket" ? "Ticket Assistant" : "AI Assistant";
  const activeMinIcon =
    openBox === "ticket" ? (
      <Lifebuoy size={22} weight="fill" />
    ) : (
      <ChatCircleDots size={22} weight="fill" />
    );

  return (
    <>
      <style>{`
        .dbl-dock {
          position: fixed;
          right: 18px;
          bottom: 28px;
          z-index: 2500;
        }

        .dbl-dock-pill {
          height: 70px;
          padding: 12px 14px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.28);
          box-shadow: 0 22px 60px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.45);
          transform: translateZ(0);
        }

        .dbl-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .dbl-brand-icon {
          width: 48px; height: 48px; border-radius: 999px;
          background: linear-gradient(135deg,#10b981,#059669);
          color: white; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 14px 34px rgba(16,185,129,0.30), inset 0 1px 0 rgba(255,255,255,0.40);
          flex: 0 0 auto;
          position: relative;
          overflow: hidden;
        }

        /* subtle glow ring */
        .dbl-brand-icon::after {
          content: "";
          position: absolute;
          inset: -20%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 55%);
          opacity: 0.0;
          transition: opacity 220ms ease;
        }
        .dbl-dock-pill:hover .dbl-brand-icon::after {
          opacity: 0.45;
        }

        .dbl-brand-text { min-width: 0; }

        .dbl-brand-title {
          font-weight: 900; font-size: 14px; line-height: 1.1; letter-spacing: -0.2px;
          color: rgba(15,23,42,0.92); white-space: nowrap;
        }
        .dbl-brand-sub { font-size: 11px; font-weight: 700; opacity: 0.70; line-height: 1.15; white-space: nowrap; }

        .dbl-suggestion {
          font-size: 12px;
          font-weight: 750;
          opacity: 0.78;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 180px;
        }

        .dbl-actions { display: flex; gap: 10px; flex: 0 0 auto; }
        .dbl-action-btn {
          width: 46px; height: 46px; border-radius: 999px; border: none;
          background: rgba(255,255,255,0.45);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: rgba(15,23,42,0.92);
          box-shadow: 0 12px 28px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.70);
          transition: transform 160ms ease, box-shadow 160ms ease;
        }
        .dbl-action-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 16px 36px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.75);
        }
        .dbl-action-btn:active { transform: scale(0.98); }

        .dbl-min-pill {
          position: fixed;
          right: 18px;
          bottom: 18px;
          height: 56px;
          padding: 0 18px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(14px) saturate(160%);
          -webkit-backdrop-filter: blur(14px) saturate(160%);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          z-index: 2600;
          box-shadow: 0 22px 60px rgba(0,0,0,0.25);
          font-weight: 900;
          color: rgba(15,23,42,0.92);
        }
      `}</style>

      {/* DOCK */}
      <AnimatePresence>
        {dockVisible && (
          <motion.div
            className="dbl-dock"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={spring}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <motion.div
              className="dbl-dock-pill"
              animate={{
                width: hovered ? hoveredWidth : idleWidth,
                y: hovered ? -1 : 0,
                scale: hovered ? 1.01 : 1,
              }}

              transition={spring}
              // ✅ idle breathing when not hovered
              whileHover={{}}
            >
              {/* idle float effect */}
              {!hovered && (
                <motion.div
                  style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div className="dbl-brand">
                <Badge dot={false} offset={[-2, 2]}>
                  <motion.div
                    className="dbl-brand-icon"
                    // ✅ sparkle pulse
                    animate={hovered ? { scale: 1 } : { scale: [1, 1.06, 1] }}
                    transition={hovered ? spring : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkle size={22} weight="fill" />
                  </motion.div>
                </Badge>

                <div className="dbl-brand-text">
                  <div className="dbl-brand-title">AI Assistant</div>
                  <div className="dbl-brand-sub">by DBL Group IT</div>

                  {/* ✅ animated rotating suggestion */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sIdx}
                      className="dbl-suggestion"
                      initial={{ opacity: 0, y: 6, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
                      transition={{ duration: 0.2 }}
                      title={suggestions[sIdx]}
                    >
                      {suggestions[sIdx]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {hovered && (
                <div className="dbl-actions">
                  {canUseTicketAI && (
                    <Tooltip title="Raise Ticket with AI" placement="top">
                      <button
                        className="dbl-action-btn"
                        type="button"
                        onClick={() => {
                          setUnread(false);
                          setOpenBox("ticket");
                          setMinimized(false);
                        }}
                      >
                        <Lifebuoy size={21} weight="fill" />
                      </button>
                    </Tooltip>
                  )}

                  <Tooltip title="AI Agent" placement="top">
                    <button
                      className="dbl-action-btn"
                      type="button"
                      onClick={() => {
                        setUnread(false);
                        setOpenBox("ai");
                        setMinimized(false);
                      }}
                    >
                      <ChatCircleDots size={21} weight="fill" />
                    </button>
                  </Tooltip>


                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT BOXES */}
      {userId && (
        <AIChatBox
          open={openBox === "ai"}
          minimized={minimized}
          onMinimize={() => setMinimized(true)}
          onRestore={() => setMinimized(false)}
          onClose={() => {
            setOpenBox(null);
            setMinimized(false);
          }}
          userId={userId} // ✅ employee_id
        />
      )}


      {canUseTicketAI && (
        <TicketChatBox
          open={openBox === "ticket"}
          minimized={minimized}
          onMinimize={() => setMinimized(true)}
          onRestore={() => setMinimized(false)}
          onClose={() => {
            setOpenBox(null);
            setMinimized(false);
          }}
          onOpenTickets={() => navigate(OPEN_TICKETS_PATH)}
        />
      )}



      {/* MINIMIZED PILL */}
      <AnimatePresence>
        {openBox && minimized && !hideByRoute && (
          <motion.button
            className="dbl-min-pill"
            type="button"
            onClick={() => setMinimized(false)}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={spring}
          >
            {activeMinIcon}
            {activeMinLabel}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
