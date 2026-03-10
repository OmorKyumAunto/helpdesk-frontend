import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  Space,
  Tag,
  Typography,
  message as antdMsg,
  Select,
  Tooltip,
  Progress,
} from "antd";
import {
  Lifebuoy,
  ListBullets,
  MagnifyingGlass,
  PaperPlaneTilt,
  ArrowUUpLeft,
  Minus,
  Broom,
  X,
  Microphone,
  Stop,
} from "@phosphor-icons/react";
import { httpsCallable, getFunctions } from "firebase/functions";
import Lottie from "lottie-react";
import { AnimatePresence, motion, useReducedMotion, useAnimationControls } from "framer-motion";

import aiListenerAnim from "../../assets/ailistener.json";
import SadAnimation from "../../assets/sadloader.json"; // adjust path if needed
import { app } from "../../firebase";
import { useGetCategoryActiveListQuery } from "../Category/api/categoryEndPoint";
import { useCreateRaiseTicketMutation } from "../ticket/api/ticketEndpoint";

import { useAppDispatch } from "../../app/store/store"; // adjust path if needed
import { setCommonModal } from "../../app/slice/modalSlice"; // adjust path if needed
import { useGetMeQuery } from "../../app/api/userApi"; // adjust path if needed
import SeatingLocationModal from "../employee/components/SeatingLocationModal"; // adjust path if needed

import {
  loadCategoryCache,
  saveCategoryCache,
  findCategoryIdByTitle,
  type TicketCategory,
} from "./utils/categoryCache";

const { Title, Text } = Typography;

type AnalyzeResult = {
  isTicket: boolean;
  confidence: number;
  category: string;
  priority: string;
  subject: string;
  description: string;
};

function toPlainText(text: string) {
  return (text || "").replace(/\s+/g, " ").trim();
}

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const;
type Priority = (typeof PRIORITY_OPTIONS)[number];

const PRIORITY_MAP: Record<string, Priority> = {
  low: "low",
  medium: "medium",
  high: "high",
  urgent: "urgent",
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
};

const UNDO_SECONDS = 5;

const SPRING = { type: "spring", stiffness: 420, damping: 34, mass: 0.9 } as const;
const SPRING_SOFT = { type: "spring", stiffness: 320, damping: 32, mass: 1 } as const;

/** --- Web Speech API types (no extra deps) --- */
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: any) => void);
  onresult: null | ((event: any) => void);
};

function getSpeechRecognitionCtor(): any | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export default function TicketChatBox({
  open,
  minimized,
  onMinimize,
  onRestore,
  onClose,
  onOpenTickets,
}: {
  open: boolean;
  minimized: boolean;
  onMinimize: () => void;
  onRestore: () => void;
  onClose: () => void;
  onOpenTickets: () => void;
}) {
  const reduceMotion = useReducedMotion();

  // ✅ Seating location modal integration
  const dispatch = useAppDispatch();
  const { data: { data: profile } = {} } = useGetMeQuery();
  const [seatErrorVisible, setSeatErrorVisible] = useState(false);
  const [seatCountdown, setSeatCountdown] = useState(3);
  const seatTimerRef = useRef<number | null>(null);

  const [issue, setIssue] = useState("");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);

  // review fields (editable)
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priority, setPriority] = useState<Priority>("medium");
  const [subject, setSubject] = useState("");
  const [descriptionText, setDescriptionText] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // undo timer
  const [undoSec, setUndoSec] = useState<number | null>(null);
  const [undoProgress, setUndoProgress] = useState<number>(0);
  const undoEndAtRef = useRef<number | null>(null);

  const submitTimeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);

  const [createTicket] = useCreateRaiseTicketMutation();

  // ✅ zoom in/out controls for cards
  const cardsControls = useAnimationControls();
  const pulseCards = async () => {
    if (reduceMotion) return;
    await cardsControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.32, ease: "easeInOut" },
    });
  };

  // ---------- categories dynamic (with cache) ----------
  const cached = useMemo(() => loadCategoryCache(), []);
  const hasCached = !!cached?.length;
  const { data: categoryData } = useGetCategoryActiveListQuery({}, { skip: hasCached });

  const categories: TicketCategory[] = useMemo(() => {
    if (cached?.length) return cached;
    return categoryData?.data?.map((x: any) => ({ id: x.id, title: x.title })) || [];
  }, [cached, categoryData]);

  useEffect(() => {
    if (!hasCached && categories.length) saveCategoryCache(categories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData]);

  const categoryTitlesForAI = useMemo(() => categories.map((c) => c.title), [categories]);

  // ✅ Smart: suppress voice "stopped" toast when we intentionally stop it (Analyze/Close/Clear/etc.)
  const suppressVoiceEndToastRef = useRef(false);

  const clearTimers = () => {
    if (submitTimeoutRef.current) window.clearTimeout(submitTimeoutRef.current);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);

    if (seatTimerRef.current) window.clearTimeout(seatTimerRef.current);

    submitTimeoutRef.current = null;
    countdownRef.current = null;
    progressRef.current = null;
    seatTimerRef.current = null;

    undoEndAtRef.current = null;
    setUndoSec(null);
    setUndoProgress(0);
  };

  // ✅ cleanup on unmount (prevents zombie submit)
  useEffect(() => {
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------- ✅ Voice Input --------------------
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceBaseTextRef = useRef<string>(""); // text that existed before current listen session
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);

  const stopVoice = () => {
    // we might call stopVoice even when listening state is stale
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    setVoiceSupported(!!Ctor);

    if (!Ctor) return;

    const rec: SpeechRecognitionLike = new Ctor();
    rec.lang = "en-US"; // change if you want (e.g. "bn-BD")
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);

    // ✅ Smart feedback: toast only when it stops automatically, not when we intentionally stop it
    rec.onend = () => {
      setListening(false);

      if (suppressVoiceEndToastRef.current) {
        suppressVoiceEndToastRef.current = false;
        return;
      }

      antdMsg.info("Voice input stopped.");
    };

    rec.onerror = (e: any) => {
      setListening(false);
      const code = e?.error || "unknown";
      if (code === "not-allowed" || code === "service-not-allowed") {
        antdMsg.error("Microphone permission denied. Please allow mic access in the browser.");
      } else if (code === "no-speech") {
        antdMsg.info("No speech detected.");
      } else {
        antdMsg.error(`Voice input error: ${code}`);
      }
    };

    rec.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const txt = res?.[0]?.transcript ?? "";
        if (res.isFinal) finalText += txt;
        else interimText += txt;
      }

      const base = voiceBaseTextRef.current || "";
      const combined = toPlainText(`${base} ${finalText} ${interimText}`);
      setIssue(combined);
    };

    recognitionRef.current = rec;

    return () => {
      try {
        rec.onstart = null;
        rec.onend = null;
        rec.onerror = null;
        rec.onresult = null;
        rec.abort();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const startVoice = () => {
    if (!voiceSupported) return antdMsg.warning("Voice input is not supported in this browser.");
    if (listening) return;

    voiceBaseTextRef.current = issue.trim();

    try {
      recognitionRef.current?.start();
    } catch {
      antdMsg.error("Could not start microphone. Try again.");
    }
  };

  const toggleVoice = () => {
    if (listening) stopVoice();
    else startVoice();
  };

  // Stop mic when modal closes/minimized (silent)
  useEffect(() => {
    if (!open || minimized) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, minimized]);
  // --------------------------------------------------------

  const resetAll = async () => {
    clearTimers();

    // silent stop
    suppressVoiceEndToastRef.current = true;
    stopVoice();

    setIssue("");
    setAnalysis(null);
    setCategoryId(null);
    setPriority("medium");
    setSubject("");
    setDescriptionText("");
    await pulseCards();
  };

  const undo = () => {
    clearTimers();
    antdMsg.info("Submission canceled.");
  };

  // ✅ Seating error countdown → open seating location modal
  useEffect(() => {
    if (!seatErrorVisible) return;

    if (seatCountdown > 0) {
      seatTimerRef.current = window.setTimeout(() => {
        setSeatCountdown((c) => c - 1);
      }, 1000);
    } else {
      setSeatErrorVisible(false);
      setSeatCountdown(3);

      dispatch(
        setCommonModal({
          show: true,
          title: "Update Seating Location",
          content: <SeatingLocationModal employee={profile} />,
        })
      );
    }

    return () => {
      if (seatTimerRef.current) window.clearTimeout(seatTimerRef.current);
      seatTimerRef.current = null;
    };
  }, [seatErrorVisible, seatCountdown, dispatch, profile]);

  const runAnalyze = async () => {
    // ✅ stop voice automatically when analyzing (silent)
    if (listening) {
      suppressVoiceEndToastRef.current = true;
      stopVoice();
    }

    if (issue.trim().length < 5) return antdMsg.warning("Write a bit more details.");
    if (!categoryTitlesForAI.length) return antdMsg.warning("Categories not loaded yet.");

    setAnalyzing(true);
    try {
      const fn = httpsCallable(getFunctions(app), "analyzeTicketWithGemini");
      const res = await fn({ transcript: issue, categories: categoryTitlesForAI });

      const ai = (res.data as any)?.data as AnalyzeResult | undefined;
      if (!ai) throw new Error("Analyze returned empty");

      setAnalysis(ai);

      const id = findCategoryIdByTitle(categories, ai.category) ?? categories[0]?.id ?? null;
      setCategoryId(id);

      setPriority(PRIORITY_MAP[ai.priority] ?? "medium");
      setSubject(ai.subject || "IT Issue");
      setDescriptionText(toPlainText(ai.description || issue));

      setTimeout(() => document.getElementById("dbl-review-card")?.scrollIntoView({ behavior: "smooth" }), 90);
    } catch (e: any) {
      antdMsg.error(e?.message || "Analyze failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const submitWithUndo = () => {
    if (!analysis) return antdMsg.warning("Analyze first.");
    if (!categoryId) return antdMsg.error("Category missing.");
    if (!subject.trim()) return antdMsg.error("Subject missing.");
    if (!descriptionText.trim()) return antdMsg.error("Description missing.");
    if (undoSec !== null) return;

    const endAt = Date.now() + UNDO_SECONDS * 1000;
    undoEndAtRef.current = endAt;

    setUndoSec(UNDO_SECONDS);
    setUndoProgress(100);

    countdownRef.current = window.setInterval(() => {
      setUndoSec((s) => (s === null ? null : Math.max(0, s - 1)));
    }, 1000);

    progressRef.current = window.setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, (undoEndAtRef.current ?? now) - now);
      const pct = (remaining / (UNDO_SECONDS * 1000)) * 100;
      setUndoProgress(Math.max(0, Math.min(100, pct)));
    }, 80);

    submitTimeoutRef.current = window.setTimeout(async () => {
      clearTimers();
      setSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("category_id", String(categoryId));
        fd.append("priority", priority);
        fd.append("subject", subject.trim());
        fd.append("description", `<p>${descriptionText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`);

        await createTicket(fd as any).unwrap();
        await resetAll();
        onClose();
      } catch (e: any) {
        const msg = e?.data?.message || e?.message || "Submit failed";

        if (
          msg ===
          "Your seating location has not been updated. Please update your current seating location."
        ) {
          setSeatErrorVisible(true);
          setSeatCountdown(3);
          return;
        }

        antdMsg.error(msg);
      } finally {
        setSubmitting(false);
      }
    }, UNDO_SECONDS * 1000);

    antdMsg.open({
      type: "info",
      content: (
        <Space>
          <span>Submitting in {UNDO_SECONDS}s…</span>
        </Space>
      ),
      duration: UNDO_SECONDS,
    });
  };

  const closeAll = () => {
    clearTimers();

    // silent stop
    suppressVoiceEndToastRef.current = true;
    stopVoice();

    onClose();
  };

  if (!open || minimized) return null;

  const showReview = !!analysis;

  const showClear =
    issue.trim().length > 0 ||
    !!analysis ||
    subject.trim().length > 0 ||
    descriptionText.trim().length > 0 ||
    categoryId !== null;

  return (
    <>
      <style>{`
        .dblTicketModal .ant-modal-content,
        .dblTicketModal .ant-modal-header,
        .dblTicketModal .ant-modal-body,
        .dblTicketModal .ant-modal-footer {
          border-radius: 22px !important;
        }
        .dblTicketModal .ant-modal-body{ padding: 0 !important; }

        .dblTicketFrame{
          border-radius: 22px;
          overflow: hidden;
          position: relative;
        }

        .dblTicketModal .ant-modal-content{
          border: 1px solid rgba(255,255,255,0.20);
          background:
            radial-gradient(1200px 520px at 30% 0%, rgba(59,130,246,0.16), transparent 55%),
            radial-gradient(900px 420px at 85% 10%, rgba(16,185,129,0.14), transparent 52%),
            rgba(255,255,255,0.12);
          backdrop-filter: blur(26px) saturate(165%);
          -webkit-backdrop-filter: blur(26px) saturate(165%);
          box-shadow: 0 34px 110px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.35);
        }

        .dblTicketHeader{
          padding: 14px 14px;
          border-bottom: 1px solid rgba(15,23,42,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.18));
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dblTicketBrand{
          display:flex;
          align-items:center;
          gap: 12px;
          min-width: 0;
          flex: 1 1 320px;
        }

        .dblTicketIcon{
          width: 42px; height: 42px;
          border-radius: 16px;
          display:flex;
          align-items:center;
          justify-content:center;
          color: #fff;
          background: linear-gradient(135deg,#10b981,#059669);
          box-shadow: 0 16px 44px rgba(16,185,129,0.24), inset 0 1px 0 rgba(255,255,255,0.35);
          flex: 0 0 auto;
        }

        .dblTicketTitle{
          font-weight: 950;
          letter-spacing: -0.3px;
          font-size: 15px;
          color: rgba(15,23,42,0.92);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dblTicketSub{
          font-size: 12px;
          font-weight: 800;
          opacity: .72;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 620px;
        }

        .dblTicketHeaderActions{
          display:flex;
          align-items:center;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .dblTicketPillBtn.ant-btn{
          border-radius: 999px !important;
          height: 38px;
          font-weight: 950;
          border: 1px solid rgba(15,23,42,0.12) !important;
          background: rgba(255,255,255,0.66) !important;
          padding: 0 12px !important;
          display:flex;
          align-items:center;
          gap: 8px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.65);
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .dblTicketPillBtn.ant-btn:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,0.78) !important;
          box-shadow: 0 16px 36px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.70);
        }

        .dblTicketIconBtn.ant-btn{
          width: 38px !important;
          height: 38px !important;
          border-radius: 999px !important;
          border: 1px solid rgba(15,23,42,0.12) !important;
          background: rgba(255,255,255,0.66) !important;
          box-shadow: 0 10px 28px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.65);
          padding: 0 !important;
          display:flex;
          align-items:center;
          justify-content:center;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .dblTicketIconBtn.ant-btn:hover{
          transform: translateY(-1px);
          background: rgba(255,255,255,0.78) !important;
          box-shadow: 0 16px 36px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.70);
        }

        /* ✅ STOP state = RED */
        .dblTicketIconBtnStop.ant-btn{
          background: rgba(239,68,68,0.18) !important;
          border-color: rgba(239,68,68,0.40) !important;
          color: rgba(185,28,28,0.95) !important;
          box-shadow: 0 10px 28px rgba(239,68,68,0.14), inset 0 1px 0 rgba(255,255,255,0.55);
        }
        .dblTicketIconBtnStop.ant-btn:hover{
          background: rgba(239,68,68,0.26) !important;
          border-color: rgba(239,68,68,0.55) !important;
          transform: translateY(-1px);
          box-shadow: 0 16px 36px rgba(239,68,68,0.18), inset 0 1px 0 rgba(255,255,255,0.60);
        }

        .dblTicketBody{
          padding: 14px;
          background:
            radial-gradient(1200px 520px at 50% 0%, rgba(59,130,246,0.10), transparent 60%),
            linear-gradient(180deg, rgba(248,250,252,0.52), rgba(255,255,255,0.12));
        }

        .dblGrid{
          display:grid;
          grid-template-columns: ${showReview ? "1.05fr 0.95fr" : "1fr"};
          gap: 12px;
          align-items: start;
        }

        .dblCard{
          border-radius: 20px !important;
          border: 1px solid rgba(15,23,42,0.08) !important;
          background: rgba(255,255,255,0.80) !important;
          box-shadow: 0 18px 46px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.65);
          overflow: hidden;
        }
        .dblCard .ant-card-body{ padding: 14px; }

        .dblCardTopLine{
          height: 4px;
          width: 100%;
          background: linear-gradient(90deg, rgba(59,130,246,0.55), rgba(16,185,129,0.55));
          opacity: 0.9;
        }

        .dblPrimaryBtn.ant-btn{
          height: 44px;
          border-radius: 14px;
          font-weight: 950;
          border: none;
          background: linear-gradient(135deg,#3b82f6,#2563eb);
          box-shadow: 0 18px 46px rgba(59,130,246,0.26), inset 0 1px 0 rgba(255,255,255,0.35);
          display:flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          padding: 0 16px;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease, background 180ms ease;
        }
        .dblPrimaryBtn.ant-btn:hover{
          transform: translateY(-2px);
          filter: saturate(1.03) brightness(1.03);
          background: linear-gradient(135deg,#2563eb,#1d4ed8);
          box-shadow: 0 22px 56px rgba(59,130,246,0.32), inset 0 1px 0 rgba(255,255,255,0.38);
        }

        .dblSoftBtn.ant-btn{
          height: 44px;
          border-radius: 14px;
          font-weight: 950;
          border: 1px solid rgba(15,23,42,0.12) !important;
          background: rgba(255,255,255,0.72) !important;
        }

        .dblPillTag{
          border-radius: 999px;
          padding: 4px 10px;
          font-weight: 950;
        }

        .dblTicketModal .ant-input,
        .dblTicketModal .ant-select-selector{
          border-radius: 14px !important;
        }

        .dblAnalyzeOverlay{
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          background: rgba(2,6,23,0.36);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .dblAnalyzePanel{
          width: min(420px, 92vw);
          border-radius: 22px;
          padding: 18px 18px 14px;
          background: rgba(255,255,255,0.16);
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: 0 32px 90px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.35);
          text-align: center;
        }
        .dblAnalyzeTitle{
          margin-top: 8px;
          font-weight: 950;
          color: rgba(255,255,255,0.95);
          font-size: 14px;
        }
        .dblAnalyzeSub{
          margin-top: 4px;
          font-weight: 800;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
        }

        @media (max-width: 860px){
          .dblGrid{ grid-template-columns: 1fr; }
        }
        @media (max-width: 520px){
          .dblBtnText{ display:none; }
          .dblTicketSub{ max-width: 220px; }
          .dblTicketPillBtn.ant-btn{ padding: 0 10px !important; }
        }
      `}</style>

      <Modal
        className="dblTicketModal"
        open={open}
        onCancel={closeAll}
        footer={null}
        centered
        width={showReview ? 980 : 740}
        title={null}
        closable={false}
        destroyOnClose
      >
        <div className="dblTicketFrame">
          {/* analyzing overlay */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                className="dblAnalyzeOverlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
              >
                <motion.div
                  className="dblAnalyzePanel"
                  initial={{ scale: 0.88, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 6 }}
                  transition={reduceMotion ? { duration: 0 } : SPRING_SOFT}
                >
                  <motion.div
                    initial={{ scale: 0.96 }}
                    animate={{ scale: reduceMotion ? 1 : [0.96, 1.02, 0.985, 1] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: 220, height: 220, margin: "0 auto" }}
                  >
                    <Lottie animationData={aiListenerAnim} loop autoplay />
                  </motion.div>
                  <div className="dblAnalyzeTitle">Analyzing your issue…</div>
                  <div className="dblAnalyzeSub">Creating category, priority, subject & description</div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* header */}
          <div className="dblTicketHeader">
            <div className="dblTicketBrand">
              <div className="dblTicketIcon">
                <Lifebuoy size={20} weight="fill" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="dblTicketTitle">Raise Ticket with AI</div>
                <div className="dblTicketSub">
                  Describe → Analyze → Review → Submit (Undo {UNDO_SECONDS}s)
                </div>
              </div>
            </div>

            <div className="dblTicketHeaderActions">
              <Tooltip title="Open ticket list">
                <Button
                  className="dblTicketPillBtn"
                  icon={<ListBullets size={18} />}
                  onClick={() => {
                    onOpenTickets();
                    closeAll();
                  }}
                >
                  <span className="dblBtnText">Tickets</span>
                </Button>
              </Tooltip>

              {showClear && (
                <Tooltip title="Clear draft">
                  <Button
                    className="dblTicketPillBtn"
                    icon={<Broom size={18} />}
                    onClick={async () => {
                      await resetAll();
                      antdMsg.info("Cleared Draft.");
                    }}
                  >
                    <span className="dblBtnText">Clear</span>
                  </Button>
                </Tooltip>
              )}

              <Tooltip title={voiceSupported ? (listening ? "Stop voice" : "Voice input") : "Not supported"}>
                <Button
                  className={`dblTicketIconBtn ${listening ? "dblTicketIconBtnStop" : ""}`}
                  onClick={toggleVoice}
                  disabled={!voiceSupported || analyzing}
                  aria-label={listening ? "Stop voice" : "Start voice"}
                >
                  {listening ? <Stop size={18} weight="bold" /> : <Microphone size={18} weight="bold" />}
                </Button>
              </Tooltip>

              <Tooltip title="Minimize">
                <Button className="dblTicketIconBtn" onClick={onMinimize} aria-label="Minimize">
                  <Minus size={18} weight="bold" />
                </Button>
              </Tooltip>

              <Tooltip title="Close">
                <Button className="dblTicketIconBtn" onClick={closeAll} aria-label="Close">
                  <X size={18} weight="bold" />
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* body */}
          <div className="dblTicketBody">
            <motion.div animate={cardsControls} transition={reduceMotion ? { duration: 0 } : SPRING} className="dblGrid">
              {/* left */}
              <motion.div
                transition={reduceMotion ? { duration: 0 } : SPRING}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div transition={reduceMotion ? { duration: 0 } : SPRING_SOFT} animate={{ scale: 1 }}>
                  <Card className="dblCard">
                    <div className="dblCardTopLine" />
                    <div style={{ paddingTop: 10 }}>
                      <Space direction="vertical" style={{ width: "100%" }} size={10}>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>
                            Describe your issue
                          </Title>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Add error text, module name, when it started, and steps.
                          </Text>
                        </div>

                        <Input.TextArea
                          rows={7}
                          value={issue}
                          onChange={(e) => setIssue(e.target.value)}
                          placeholder="Example: VPN not connecting since morning. Error: Authentication failed..."
                        />

                        <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                          <Space wrap>
                            <Button
                              className="dblPrimaryBtn"
                              type="primary"
                              onClick={runAnalyze}
                              disabled={!categoryTitlesForAI.length || analyzing}
                              icon={<MagnifyingGlass size={18} weight="bold" />}
                            >
                              Analyze
                            </Button>
                          </Space>

                          {!categoryTitlesForAI.length && (
                            <Tag className="dblPillTag" color="gold">
                              Loading categories…
                            </Tag>
                          )}

                          {listening && (
                            <Tag className="dblPillTag" color="green">
                              Listening…
                            </Tag>
                          )}
                        </Space>

                        {analysis && (
                          <div style={{ marginTop: 14 }}>
                            <div
                              style={{
                                borderRadius: 18,
                                border: "1px solid rgba(15,23,42,0.10)",
                                background: "rgba(255,255,255,0.75)",
                                padding: 12,
                                boxShadow: "0 10px 26px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.65)",
                              }}
                            >
                              <Space style={{ width: "100%", justifyContent: "space-between" }} wrap>
                                <div style={{ minWidth: 160 }}>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    AI Category
                                  </Text>
                                  <div style={{ fontWeight: 950 }}>{analysis.category}</div>
                                </div>

                                <div style={{ minWidth: 130 }}>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    AI Priority
                                  </Text>
                                  <div style={{ fontWeight: 950 }}>{analysis.priority}</div>
                                </div>

                                <Tag
                                  className="dblPillTag"
                                  color={analysis.isTicket ? "green" : "red"}
                                  style={{ marginInlineStart: "auto" }}
                                >
                                  {analysis.isTicket
                                    ? `Ticket • ${Math.round(analysis.confidence * 100)}%`
                                    : `Not ticket • ${Math.round(analysis.confidence * 100)}%`}
                                </Tag>
                              </Space>
                            </div>
                          </div>
                        )}
                      </Space>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* right */}
              <AnimatePresence>
                {showReview && (
                  <motion.div
                    id="dbl-review-card"
                    initial={{ opacity: 0, y: 10, scale: 0.965 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.985 }}
                    transition={reduceMotion ? { duration: 0 } : SPRING_SOFT}
                  >
                    <Card className="dblCard">
                      <div className="dblCardTopLine" />
                      <div style={{ paddingTop: 10 }}>
                        <Space direction="vertical" style={{ width: "100%" }} size={10}>
                          <Space style={{ width: "100%", justifyContent: "space-between" }}>
                            <Title level={5} style={{ margin: 0 }}>
                              Review & edit
                            </Title>
                          </Space>

                          <div>
                            <Text strong>Category</Text>
                            <Select
                              style={{ width: "100%", marginTop: 6 }}
                              value={categoryId ?? undefined}
                              onChange={(v) => setCategoryId(v)}
                              options={categories.map((c) => ({ value: c.id, label: c.title }))}
                              showSearch
                              optionFilterProp="label"
                              disabled={!categories.length}
                            />
                          </div>

                          <div>
                            <Text strong>Priority</Text>
                            <Select
                              style={{ width: "100%", marginTop: 6 }}
                              value={priority}
                              onChange={(v) => setPriority(v)}
                              options={PRIORITY_OPTIONS.map((p) => ({ value: p, label: p.toUpperCase() }))}
                            />
                          </div>

                          <div>
                            <Text strong>Subject</Text>
                            <Input
                              style={{ marginTop: 6 }}
                              value={subject}
                              onChange={(e) => setSubject(e.target.value)}
                              placeholder="Short subject"
                            />
                          </div>

                          <div>
                            <Text strong>Description</Text>
                            <Input.TextArea
                              rows={6}
                              style={{ marginTop: 6 }}
                              value={descriptionText}
                              onChange={(e) => setDescriptionText(e.target.value)}
                              placeholder="Review/edit description"
                            />
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            {undoSec !== null ? (
                              <Space direction="vertical" size={4} style={{ minWidth: 210 }}>
                                <Tag className="dblPillTag" color="gold" style={{ margin: 0 }}>
                                  Undo in {undoSec}s
                                </Tag>
                                <Progress percent={Math.round(undoProgress)} showInfo={false} size="small" status="active" />
                              </Space>
                            ) : (
                              <span />
                            )}

                            {undoSec === null ? (
                              <Button
                                className="dblPrimaryBtn"
                                type="primary"
                                icon={<PaperPlaneTilt size={18} weight="fill" />}
                                onClick={submitWithUndo}
                                loading={submitting}
                              >
                                Submit
                              </Button>
                            ) : (
                              <Button
                                className="dblSoftBtn"
                                icon={<ArrowUUpLeft size={18} />}
                                onClick={undo}
                                disabled={submitting}
                              >
                                Undo
                              </Button>
                            )}
                          </div>
                        </Space>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </Modal>

      {/* Seating Location Error Modal */}
      <Modal
        open={seatErrorVisible}
        centered
        closable={false}
        footer={null}
        onCancel={() => {
          setSeatErrorVisible(false);
          setSeatCountdown(3);
        }}
        width={420}
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Lottie
            animationData={SadAnimation}
            loop={false}
            style={{ width: 160, height: 160, marginBottom: "12px", margin: "0 auto" }}
          />

          <Title level={4} style={{ marginBottom: "8px", color: "#262626" }}>
            Opps!!! Seating Location Not Updated
          </Title>

          <Text type="secondary" style={{ fontSize: "14px", display: "block", marginBottom: "16px" }}>
            Your Seating Location hasn't been updated. Please contact with IT Support Team.
          </Text>

          <div
            style={{
              background: "#f5f5f5",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "20px",
            }}
          >
            <Text style={{ fontSize: "13px", color: "#595959" }}>
              Opening seating location form in{" "}
              <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                {seatCountdown}
              </Text>{" "}
              second{seatCountdown !== 1 ? "s" : ""}...
            </Text>
          </div>
        </div>
      </Modal>
    </>
  );
}
