export type FuncMsg = { role: "user" | "model"; content: string };

type StreamArgs = {
  url: string;
  message: string;
  userId: string;
  conversationHistory: FuncMsg[];
  systemPrompt?: string;
  files?: File[];
  signal?: AbortSignal;
  onText: (chunk: string) => void;
  onDone: () => void;
  onError: (e: Error) => void;
};

/**
 * Parses SSE frames that look like:
 *   data: {"text":"Hello","done":false}
 *
 *   data: {"done":true}
 *
 * Frames are separated by a blank line (\n\n).
 */
function parseSseFrames(buffer: string): { events: string[]; rest: string } {
  // SSE events are separated by blank lines
  const parts = buffer.split(/\n\n/);
  const rest = parts.pop() ?? "";
  return { events: parts, rest };
}

function extractDataLines(eventBlock: string): string[] {
  // An SSE event can have multiple `data:` lines.
  // We collect them and join with \n (SSE spec).
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
    files = [],
    signal,
    onText,
    onDone,
    onError,
  } = args;

  try {
    const hasFiles = files.length > 0;

    const res = await fetch(url, {
      method: "POST",
      headers: hasFiles ? undefined : { "Content-Type": "application/json" },
      body: hasFiles
        ? (() => {
            const fd = new FormData();
            fd.append("message", message);
            fd.append("userId", userId);
            fd.append("conversationHistory", JSON.stringify(conversationHistory || []));
            if (systemPrompt) fd.append("systemPrompt", systemPrompt);
            files.forEach((f) => fd.append("files", f, f.name));
            return fd;
          })()
        : JSON.stringify({
            message,
            userId,
            conversationHistory: conversationHistory || [],
            systemPrompt,
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

          // Your server sends JSON in the data payload
          try {
            const payload = JSON.parse(dataStr) as { text?: string; done?: boolean };

            if (payload.text) onText(payload.text);
            if (payload.done) {
              onDone();
              return; // stop reading
            }
          } catch {
            // If a non-JSON message slips in, just ignore or append raw:
            // onText(dataStr);
          }
        }
      }
    }

    // If stream ends without explicit done:true
    onDone();
  } catch (err: any) {
    if (err?.name === "AbortError") {
      onError(new Error("Stopped"));
      return;
    }
    onError(err instanceof Error ? err : new Error("Stream error"));
  }
}
