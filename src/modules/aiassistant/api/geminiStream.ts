import { TOKEN } from "../../../helper/constant";
export type FuncMsg = { role: "user" | "model"; content: string };

type StreamArgs = {
  url: string;
  message: string;
  userId: string;
  conversationHistory: FuncMsg[];
  systemPrompt?: string;

  // ✅ NEW (for asset mode)
  mode?: "assets" | "sop";
  category?: string | null;
  isAdmin?: boolean;

  // ✅ NEW (forward auth to backend -> backend forwards to asset API)
  authToken?: string; // e.g. "Bearer <idToken>"

  // NOTE: backend currently expects JSON only, so we won't send FormData
  files?: File[]; // kept for future; ignored unless you upgrade backend
  signal?: AbortSignal;

  onText: (chunk: string) => void;
  onDone: () => void;
  onError: (e: Error) => void;
};

function parseSseFrames(buffer: string): { events: string[]; rest: string } {
  const parts = buffer.split(/\n\n/);
  const rest = parts.pop() ?? "";
  return { events: parts, rest };
}

function extractDataLines(eventBlock: string): string[] {
  const lines = eventBlock.split(/\n/);
  const dataLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trimEnd();
    if (!trimmed) continue;
    if (trimmed.startsWith("data:")) {
      dataLines.push(trimmed.slice(5).trimStart());
    }
  }
  return dataLines;
}

export async function streamChatWithGemini(args: StreamArgs) {
  const {
    url,
    message,
    userId,
    conversationHistory,
    systemPrompt,

    mode,
    category,
    isAdmin,
    authToken,

    files = [],
    signal,
    onText,
    onDone,
    onError,
  } = args;

  try {
    const token = localStorage.getItem(TOKEN);

    const bearer = authToken || (token ? `Bearer ${token}` : undefined);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: token, // ✅ raw
              token: token, // ✅ many backends use this
              "x-access-token": token, // ✅ common
            }
          : {}),
      },
      body: JSON.stringify({
        message,
        userId,
        conversationHistory: conversationHistory || [],
        systemPrompt,
        mode,
        category,
        isAdmin: !!isAdmin,
        hasFiles: files.length > 0,
        fileNames: files.map((f) => f.name),
      }),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `HTTP ${res.status}`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No stream body");

    const decoder = new TextDecoder();
    let buf = "";
    let done = false;

    while (!done) {
      const { value, done: d } = await reader.read();
      done = d;

      if (value) {
        buf += decoder.decode(value, { stream: true });

        const { events, rest } = parseSseFrames(buf);
        buf = rest;

        for (const ev of events) {
          const dataLines = extractDataLines(ev);
          if (!dataLines.length) continue;

          const dataStr = dataLines.join("\n");

          try {
            const payload = JSON.parse(dataStr) as {
              text?: string;
              done?: boolean;
            };

            if (payload.text) onText(payload.text);
            if (payload.done) {
              onDone();
              return;
            }
          } catch {
            // ignore non-JSON frames
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    if (err?.name === "AbortError") {
      onError(new Error("Stopped"));
      return;
    }
    onError(err instanceof Error ? err : new Error("Stream error"));
  }
}
