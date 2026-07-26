
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { setLogout } from "../features/userSlice";
import { RootState } from "../store/store";

const baseURL = "https://helpdesk.dbl-group.com:3003/api/v1";

export const socket_url = "https://helpdesk.dbl-group.com:3003";
export const imageURLNew = "https://helpdesk.dbl-group.com:3003";

// Backend AI endpoints (replaces the Firebase Gemini functions).
export const aiChatUrl = `${baseURL}/ai/chat`;
export const aiAnalyzeUrl = `${baseURL}/ai/analyze-ticket`;

export const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).userSlice.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

// Detects an expired / invalid session, regardless of the HTTP status the
// backend uses for it. Our API returns HTTP 400 with
// `{ message: "Timeout Login First" }` when the token has expired, so a plain
// `status === 401` check is not enough.
const isSessionExpired = (error?: FetchBaseQueryError): boolean => {
  if (!error) return false;

  // Standard auth failures.
  if (error.status === 401 || error.status === 403) return true;

  // Backend-specific: expired token comes back as 400 + this message.
  if (error.status === 400) {
    const data = error.data as { message?: string } | undefined;
    const message = data?.message?.toLowerCase() ?? "";
    if (
      message.includes("timeout login first") ||
      message.includes("login first") ||
      message.includes("login again") ||
      message.includes("user not found") ||
      message.includes("unauthorize") ||
      message.includes("token expired") ||
      message.includes("jwt expired")
    ) {
      return true;
    }
  }

  return false;
};

// True when the request never reached the server (server down / unreachable /
// timed out / network offline) — as opposed to an HTTP error from the server.
export const isNetworkError = (error?: FetchBaseQueryError): boolean => {
  if (!error) return false;
  return error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR";
};

export const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // ✅ Log out once on any expired / invalid session. This clears the stale
  // token from localStorage and breaks the refetch/redirect loop that
  // otherwise keeps hammering the `me` endpoint.
  if (isSessionExpired(result?.error)) {
    const hadToken = (api.getState() as RootState).userSlice.token;
    if (hadToken) {
      api.dispatch(setLogout());
    }
  }

  return result;
};
