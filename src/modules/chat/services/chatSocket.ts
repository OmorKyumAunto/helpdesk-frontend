// src/modules/chat/services/chatSocket.ts
import { io, Socket } from "socket.io-client";
import type { IMessage } from "../types/chatTypes";

let socket: Socket | null = null;
let lastToken: string | null = null;

function log(...args: any[]) {
  // comment this line if you want silent
  // eslint-disable-next-line no-console
  console.log("[chatSocket]", ...args);
}

export function connectChatSocket(token: string) {
  const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3003";
  if (!token) return null;

  // already connected with same token
  if (socket?.connected && lastToken === token) return socket;

  // cleanup old
  if (socket) {
    try {
      socket.removeAllListeners();
      socket.disconnect();
    } catch {}
    socket = null;
  }

  lastToken = token;

  socket = io(URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { token },
  });

  socket.on("connect", () => log("connected", socket?.id));
  socket.on("disconnect", (reason) => log("disconnected", reason));
  socket.on("connect_error", (e: any) => log("connect_error", e?.message || e));

  // useful debug
  socket.on("chat:message", (m) => log("<= chat:message", m));
  socket.on("chat:typing", (p) => log("<= chat:typing", p));
  socket.on("chat:stopTyping", (p) => log("<= chat:stopTyping", p));
  socket.on("chat:receipt", (p) => log("<= chat:receipt", p));
  socket.on("presence:status", (p) => log("<= presence:status", p));
  socket.on("presence:update", (p) => log("<= presence:update", p));

  return socket;
}

// ---------- Message ----------
export function onChatMessage(cb: (m: IMessage) => void) {
  if (!socket) return () => {};
  socket.on("chat:message", cb);
  return () => socket?.off("chat:message", cb);
}

export function sendChatMessage(conversationId: number, text: string) {
  socket?.emit("chat:send", { conversationId, text });
}

// ---------- Presence ----------
export function subscribePresence(employeeIds: string[]) {
  if (!socket) return;
  socket.emit("presence:subscribe", { employeeIds });
}

export function onPresenceStatus(
  cb: (arr: { employee_id: string; online: boolean; last_seen_at?: string | null }[]) => void
) {
  if (!socket) return () => {};
  socket.on("presence:status", cb);
  return () => socket?.off("presence:status", cb);
}

export function onPresenceUpdate(
  cb: (p: { employee_id: string; online: boolean; last_seen_at?: string | null }) => void
) {
  if (!socket) return () => {};
  socket.on("presence:update", cb);
  return () => socket?.off("presence:update", cb);
}

// ---------- Typing ----------
export function emitTyping(conversationId: number) {
  socket?.emit("chat:typing", { conversationId });
}

export function emitStopTyping(conversationId: number) {
  socket?.emit("chat:stopTyping", { conversationId });
}

export function onTyping(cb: (p: any) => void) {
  if (!socket) return () => {};
  socket.on("chat:typing", cb);
  return () => socket?.off("chat:typing", cb);
}

export function onStopTyping(cb: (p: any) => void) {
  if (!socket) return () => {};
  socket.on("chat:stopTyping", cb);
  return () => socket?.off("chat:stopTyping", cb);
}

// ---------- Receipt ----------
export function onReceipt(cb: (p: any) => void) {
  if (!socket) return () => {};
  socket.on("chat:receipt", cb);
  return () => socket?.off("chat:receipt", cb);
}

export function emitRead(conversationId: number, lastReadMessageId: number) {
  socket?.emit("chat:read", { conversationId, lastReadMessageId });
}