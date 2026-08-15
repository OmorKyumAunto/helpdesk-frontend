
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { setLogout } from "../features/userSlice";
import { RootState } from "../store/store";

const baseURL = "http://localhost:3003/api/v1";

export const socket_url = "http://localhost:3003";
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

// Detects an EXPIRED / INVALID SESSION only — never a mere permission denial.
//
// This distinction matters: `verifyToken` (expired/invalid token) and
// `routeAccessChecker` (valid token, insufficient permission) can BOTH return
// 401/403. If we logged out on any 401/403, a role-3 user who touches an
// endpoint they lack permission for would be kicked to the login screen. So we
// key off the token-failure MESSAGE, not the status code alone.
//
// Our API returns HTTP 400 with `{ message: "Timeout Login First" }` (and
// similar) when the token has expired, so we scan 400/401/403 for those
// messages and ignore permission-only rejections.
const SESSION_FAIL_MESSAGES = [
  "timeout login first",
  "login first",
  "login again",
  "user not found",
  "token expired",
  "jwt expired",
  "invalid token",
  "invalid signature",
  "jwt malformed",
];

const isSessionExpired = (error?: FetchBaseQueryError): boolean => {
  if (!error) return false;
  if (error.status !== 400 && error.status !== 401 && error.status !== 403)
    return false;

  const data = error.data as { message?: string } | undefined;
  const message = data?.message?.toLowerCase() ?? "";
  return SESSION_FAIL_MESSAGES.some((m) => message.includes(m));
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
