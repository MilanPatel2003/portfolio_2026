import { NextResponse } from "next/server";
import {
  buildLocalFallbackReply,
  buildSystemPrompt,
  detectOutOfScopeQuery,
  detectPromptInjection,
  getOutOfScopeReply,
  sanitizeChatHistory,
  type ChatTurn,
} from "@/lib/portfolio-assistant";

const DEFAULT_GEMINI_MODELS = [
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 18;
const rateBuckets = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  if (rateBuckets.size > 500) {
    for (const [key, timestamps] of rateBuckets) {
      const fresh = timestamps.filter((t) => t > cutoff);
      if (fresh.length === 0) rateBuckets.delete(key);
      else rateBuckets.set(key, fresh);
    }
  }

  const timestamps = (rateBuckets.get(ip) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateBuckets.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  rateBuckets.set(ip, timestamps);
  return false;
}

function getCandidateModels(): string[] {
  const configured = process.env.GEMINI_MODEL?.trim();
  if (!configured) return DEFAULT_GEMINI_MODELS;
  return Array.from(new Set([configured, ...DEFAULT_GEMINI_MODELS]));
}

async function queryGemini(
  apiKey: string,
  history: ChatTurn[],
): Promise<string | null> {
  const payload = {
    system_instruction: {
      parts: [{ text: buildSystemPrompt() }],
    },
    contents: history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }],
    })),
    generationConfig: {
      temperature: 0.45,
      topP: 0.9,
      maxOutputTokens: 450,
    },
  };

  for (const model of getCandidateModels()) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12_000),
      });

      if (!res.ok) {
        // Retry alternate Flash alias only on model-not-found or overload errors
        if (res.status === 404 || res.status === 429 || res.status >= 500) {
          continue;
        }
        return null;
      }

      const json = (await res.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const reply = json.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();

      if (reply) return reply;
    } catch {
      continue;
    }
  }

  return null;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "You've sent quite a few messages quickly! Please wait a few minutes or reach Milan directly at milanpatel6454@gmail.com.",
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const history = sanitizeChatHistory(
    (body as { messages?: unknown } | null)?.messages,
  );
  const latest = history.at(-1);

  if (!latest || latest.role !== "user") {
    return NextResponse.json(
      { error: "Please provide a user message." },
      { status: 400 },
    );
  }

  if (detectPromptInjection(latest.text) || detectOutOfScopeQuery(latest.text)) {
    return NextResponse.json({
      reply: getOutOfScopeReply(),
      mode: "guard",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({
      reply: buildLocalFallbackReply(latest.text),
      mode: "local",
    });
  }

  const geminiReply = await queryGemini(apiKey, history);
  if (geminiReply) {
    return NextResponse.json({
      reply: geminiReply,
      mode: "gemini",
    });
  }

  return NextResponse.json({
    reply: buildLocalFallbackReply(latest.text),
    mode: "local",
  });
}
