import { api } from "../../../app/api/api";
import { HTTPResponse } from "../../../app/types/commonTypes";
import { CreateDmRequest, IConversation, IMessage } from "../types/chatTypes";

export const chatEndPoint = api.injectEndpoints({
  endpoints: (build) => ({
   
    // ✅ GET /api/v1/chat/conversations (support includeArchived)
getChatInbox: build.query<HTTPResponse<IConversation[]>, { archived?: boolean } | void>({
  query: (arg) => ({
    url: "/chat/conversations",
    method: "GET",
    params: arg?.archived ? { archived: 1 } : undefined,
  }),
  providesTags: ["chat_inbox"],
}),

    // ✅ POST /api/v1/chat/dm
    createOrGetDm: build.mutation<HTTPResponse<{ conversationId: number }>, CreateDmRequest>({
      query: (body) => ({
        url: "/chat/dm",
        method: "POST",
        body,
      }),
      invalidatesTags: ["chat_inbox"],
    }),

    // ✅ GET /api/v1/chat/messages/:conversationId (pagination page)
    // Used for: refresh on click + infinite scroll
    getChatMessagesPage: build.query<
      HTTPResponse<IMessage[]>,
      { conversationId: number; limit?: number; beforeId?: number }
    >({
      query: ({ conversationId, limit = 30, beforeId }) => ({
        url: `/chat/messages/${conversationId}`,
        method: "GET",
        params: { limit, ...(beforeId ? { beforeId } : {}) },
      }),
      providesTags: (_res, _err, arg) => [{ type: "chat_messages", id: arg.conversationId }],
    }),

    // ✅ GET /api/v1/chat/messages/:conversationId (latest)
    getChatMessages: build.query<
      HTTPResponse<IMessage[]>,
      { conversationId: number; limit?: number; beforeId?: number }
    >({
      query: ({ conversationId, limit = 50, beforeId }) => ({
        url: `/chat/messages/${conversationId}`,
        method: "GET",
        params: { limit, ...(beforeId ? { beforeId } : {}) },
      }),
      providesTags: (_res, _err, arg) => [{ type: "chat_messages", id: arg.conversationId }],
    }),
    markConversationUnread: build.mutation<any, number>({
  query: (conversationId) => ({
    url: `/chat/conversations/${conversationId}/mark-unread`,
    method: "POST",
  }),
  invalidatesTags: ["chat_inbox"],
}),

markConversationRead: build.mutation<any, { conversationId: number; lastReadMessageId?: number }>({
  query: ({ conversationId, lastReadMessageId }) => ({
    url: `/chat/conversations/${conversationId}/mark-read`,
    method: "POST",
    body: lastReadMessageId ? { lastReadMessageId } : {},
  }),
  invalidatesTags: ["chat_inbox"],
}),

archiveConversationForMe: build.mutation<any, number>({
  query: (conversationId) => ({
    url: `/chat/conversations/${conversationId}/archive`,
    method: "POST",
  }),
  invalidatesTags: ["chat_inbox"],
}),

unarchiveConversationForMe: build.mutation<any, number>({
  query: (conversationId) => ({
    url: `/chat/conversations/${conversationId}/unarchive`,
    method: "POST",
  }),
  invalidatesTags: ["chat_inbox"],
}),
    // ✅ DELETE /api/v1/chat/conversations/:conversationId
    deleteConversationForMe: build.mutation<HTTPResponse<any>, { conversationId: number }>({
      query: ({ conversationId }) => ({
        url: `/chat/conversations/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["chat_inbox"],
    }),
  }),
});

export const {
  useGetChatInboxQuery,
  useCreateOrGetDmMutation,
  useGetChatMessagesQuery,
  useLazyGetChatMessagesPageQuery,
  useDeleteConversationForMeMutation,
  useMarkConversationUnreadMutation,
  useMarkConversationReadMutation,
  useArchiveConversationForMeMutation,
  useUnarchiveConversationForMeMutation,
} = chatEndPoint;