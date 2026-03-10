import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IMessage } from "../types/chatTypes";

type State = {
  activeConversationId: number | null;
  messagesByConv: Record<number, IMessage[]>;
  onlineMap: Record<string, boolean>;
  lastSeenMap: Record<string, string | null>;
  typingByConv: Record<number, boolean>;
  loadingConvId: number | null;
};

const initialState: State = {
  activeConversationId: null,
  messagesByConv: {},
  onlineMap: {},
  lastSeenMap: {},
  typingByConv: {},
  loadingConvId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversationId(state, action: PayloadAction<number | null>) {
      const nextId = action.payload ? Number(action.payload) : null;

      state.activeConversationId = nextId;

      // reset typing for active conversation
      if (nextId) state.typingByConv[nextId] = false;
    },
    seedMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      const convId = Number(conversationId);
      state.messagesByConv[convId] = (messages || [])
        .slice()
        .sort((a: any, b: any) => Number(a.id) - Number(b.id));
    },

    prependMessages: (state, action) => {
      const { conversationId, messages } = action.payload;
      const convId = Number(conversationId);
      if (!state.messagesByConv[convId]) state.messagesByConv[convId] = [];

      // older messages come before current, avoid dup
      const existingIds = new Set(
        state.messagesByConv[convId].map((x: any) => Number(x.id)),
      );
      const clean = (messages || []).filter(
        (x: any) => !existingIds.has(Number(x.id)),
      );

      state.messagesByConv[convId] = [
        ...clean,
        ...state.messagesByConv[convId],
      ];
      state.messagesByConv[convId].sort(
        (a: any, b: any) => Number(a.id) - Number(b.id),
      );
    },
    setLoadingConversation(state, action: PayloadAction<number | null>) {
      state.loadingConvId = action.payload ? Number(action.payload) : null;
    },

    clearConversationMessages(state, action: PayloadAction<number>) {
      const cid = Number(action.payload);
      state.messagesByConv[cid] = [];
    },
    appendMessage: (state, action) => {
      const m = action.payload;
      const convId = Number(m.conversation_id);
      if (!convId) return;

      if (!state.messagesByConv[convId]) state.messagesByConv[convId] = [];

      // avoid duplicate
      const exists = state.messagesByConv[convId].some(
        (x: any) => Number(x.id) === Number(m.id),
      );
      if (!exists) state.messagesByConv[convId].push(m);

      // keep sorted by id
      state.messagesByConv[convId].sort(
        (a: any, b: any) => Number(a.id) - Number(b.id),
      );
    },

    setOnlineMap(
      state,
      action: PayloadAction<{ employee_id: string; online: boolean }[]>,
    ) {
      action.payload.forEach((p) => {
        state.onlineMap[String(p.employee_id)] = !!p.online;
      });
    },

    updateOnline(
      state,
      action: PayloadAction<{ employee_id: string; online: boolean }>,
    ) {
      state.onlineMap[String(action.payload.employee_id)] =
        !!action.payload.online;
    },

    setTyping(
      state,
      action: PayloadAction<{ conversation_id: number; typing: boolean }>,
    ) {
      state.typingByConv[action.payload.conversation_id] =
        action.payload.typing;
    },
    setLastSeen(state, action) {
      state.lastSeenMap[String(action.payload.employee_id)] =
        action.payload.last_seen_at;
    },
    // receipts update for message list
    markDelivered(
      state,
      action: PayloadAction<{ message_id: number; delivered_at: string }>,
    ) {
      Object.keys(state.messagesByConv).forEach((cid) => {
        const arr = state.messagesByConv[Number(cid)] || [];
        const idx = arr.findIndex((m) => m.id === action.payload.message_id);
        if (idx !== -1) {
          arr[idx] = { ...arr[idx], delivered_at: action.payload.delivered_at };
          state.messagesByConv[Number(cid)] = [...arr];
        }
      });
    },

    markReadUpTo(
      state,
      action: PayloadAction<{
        conversation_id: number;
        last_read_message_id: number;
        read_at: string;
      }>,
    ) {
      const cid = action.payload.conversation_id;
      const arr = state.messagesByConv[cid] || [];
      const updated = arr.map((m) => {
        if (m.id <= action.payload.last_read_message_id) {
          return { ...m, read_at: action.payload.read_at };
        }
        return m;
      });
      state.messagesByConv[cid] = updated;
    },
  },
});

export const {
  setActiveConversationId,
  seedMessages,
  prependMessages,
  appendMessage,
  setOnlineMap,
  updateOnline,
  setTyping,
  setLastSeen,
  markDelivered,
  markReadUpTo,
  setLoadingConversation,
  clearConversationMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
