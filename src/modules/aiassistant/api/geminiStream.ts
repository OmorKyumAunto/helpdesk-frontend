
import { TOKEN } from "../../../helper/constant";
export type FuncMsg = { role: "user" | "model"; content: string };

type StreamArgs = {
  url: string;
  message: string;
  userId: string;
  roleId?: number | string;
  conversationHistory: FuncMsg[];
  systemPrompt?: string;
  mode?: "chat" | "assets" | "sop" | "employee";
  category?: string | null;
  isAdmin?: boolean;

  authToken?: string; // "Bearer <token>"
  files?: File[];
  signal?: AbortSignal;

  onText: (chunk: string) => void;
  onDone: () => void;
  onError: (e: Error) => void;
};

function isMyAssetsIntent(text = "") {
  const s = text.toLowerCase();
  return (
    s.includes("my asset") ||
    s.includes("my assets") ||
    s.includes("my laptop") ||
    s.includes("my device") ||
    s.includes("assigned to me") ||
    s.includes("given to me") ||
    s.includes("what assets do i have") ||
    // Banglish
    s.includes("amar asset") ||
    s.includes("amar assets") ||
    s.includes("amar kache ki ache") ||
    s.includes("amar ki ki asset") ||
    // Bangla
    s.includes("আমার অ্যাসেট") ||
    s.includes("আমার কাছে কি") ||
    s.includes("আমাকে দেয়া")
  );
}

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
    roleId,
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

  const roleIdStr = roleId != null ? String(roleId) : "";
  const effectiveMode = mode ?? "chat";

  // ✅ Role 3 (Employee): only Chat + My Assets
  if (roleIdStr === "3") {
    if (effectiveMode === "assets") {
      if (!isMyAssetsIntent(message)) {
        onError(
          new Error(
            'Employees can only access "My Assets". Try: "my assets" / "amar asset".'
          )
        );
        onDone();
        return;
      }
    } else if (effectiveMode !== "chat") {
      onError(new Error("Employees can use only Chat and My Assets."));
      onDone();
      return;
    }
  }

  try {
    const token = localStorage.getItem(TOKEN);
    const authHeader = authToken ?? (token ? `Bearer ${token}` : undefined);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        message,
        userId,
        roleId: roleIdStr || null,
        conversationHistory: conversationHistory || [],
        systemPrompt,
        mode: effectiveMode,
        category: category ?? null,
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
            const payload = JSON.parse(dataStr) as { text?: string; done?: boolean };

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
