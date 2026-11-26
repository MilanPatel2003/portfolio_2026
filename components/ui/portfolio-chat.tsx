"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  FileText,
  FolderGit2,
  Network,
  RotateCcw,
  Send,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { hero } from "@/data/data";
import { getMailtoHref, showToast } from "@/lib/events";
import {
  MAX_CHAT_MESSAGE_LENGTH,
  getStarterPrompts,
  getWelcomeGreeting,
  type ChatTurn,
} from "@/lib/portfolio-assistant";
import { site } from "@/lib/site";

const INLINE_TOKEN_RE =
  /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

function StarterIcon({ id }: { id: string }) {
  switch (id) {
    case "role":
      return <Briefcase className="h-3.5 w-3.5 shrink-0 text-brand" />;
    case "architecture":
      return <Network className="h-3.5 w-3.5 shrink-0 text-brand" />;
    case "projects":
      return <FolderGit2 className="h-3.5 w-3.5 shrink-0 text-brand" />;
    default:
      return <UserCheck className="h-3.5 w-3.5 shrink-0 text-brand" />;
  }
}

function renderInlineTokens(line: string): ReactNode[] {
  const parts = line.split(INLINE_TOKEN_RE);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="rounded-md border border-border/80 bg-muted/70 px-1.5 py-0.5 font-space-mono text-[11px] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[.,;!?]+$/, "");
      const trailing = part.slice(cleanUrl.length);
      return (
        <span key={idx}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-0.5 break-all font-medium text-brand underline underline-offset-3 hover:opacity-80"
          >
            <span>
              {cleanUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </span>
            <ArrowUpRight className="inline h-3 w-3 shrink-0 self-center" />
          </a>
          {trailing}
        </span>
      );
    }
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
      return (
        <a
          key={idx}
          href={getMailtoHref(part)}
          className="font-medium text-brand underline underline-offset-3 hover:opacity-80"
        >
          {part}
        </a>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = (keyPrefix: string) => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={keyPrefix} className="my-1.5 space-y-1.5 pl-0.5">
        {bullets.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
            />
            <span>{renderInlineTokens(item)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    if (/^[-*]\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }
    flushBullets(`bullets-${index}`);
    if (!trimmed) return;
    blocks.push(
      <p key={`p-${index}`} className="leading-relaxed [&+p]:mt-1.5">
        {renderInlineTokens(trimmed)}
      </p>,
    );
  });

  flushBullets("bullets-end");
  return <div className="space-y-1 text-[13px]">{blocks}</div>;
}

export function PortfolioChat() {
  const starterPrompts = useMemo(() => getStarterPrompts(), []);
  const welcomeTurn = useMemo<ChatTurn>(
    () => ({ role: "assistant", text: getWelcomeGreeting() }),
    [],
  );

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>(() => [welcomeTurn]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [mode, setMode] = useState<"gemini" | "local" | "guard" | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const loadingRef = useRef(loading);

  useEffect(() => {
    messagesRef.current = messages;
    loadingRef.current = loading;
  }, [messages, loading]);

  const resizeTextarea = useCallback((el?: HTMLTextAreaElement | null) => {
    const node = el ?? textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 112)}px`;
  }, []);

  const sendMessage = useCallback(async (rawText: string) => {
    const text = rawText.trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
    if (!text || loadingRef.current) return;

    const userTurn: ChatTurn = { role: "user", text };
    const nextMessages = [...messagesRef.current, userTurn];
    setMessages(nextMessages);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-8),
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        mode?: "gemini" | "local" | "guard";
      };

      if (data.mode) setMode(data.mode);

      const replyText =
        data.reply ||
        data.error ||
        `Something went wrong temporarily — feel free to reach ${hero.firstName} directly at ${hero.email}.`;

      setMessages((prev) => [...prev, { role: "assistant", text: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Connection slipped for a moment — you can check ${hero.firstName}'s sections directly or email him at ${hero.email}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onOpenChat = (event: CustomEvent<{ prompt?: string }>) => {
      setOpen(true);
      const prefill = event.detail?.prompt?.trim();
      if (prefill) {
        void sendMessage(prefill);
      }
    };
    window.addEventListener("portfolio:chat", onOpenChat as EventListener);
    return () =>
      window.removeEventListener("portfolio:chat", onOpenChat as EventListener);
  }, [sendMessage]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !open) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: messages.length > 1 ? "smooth" : "auto",
    });
  }, [messages, loading, open]);

  function resetChat() {
    setMessages([welcomeTurn]);
    setMode(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText(hero.email).then(
      () => showToast("Copied email to clipboard"),
      () => showToast("Failed to copy email"),
    );
  }

  function copyReply(index: number, text: string) {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopiedIdx(index);
        showToast("Copied reply to clipboard");
        setTimeout(() => setCopiedIdx(null), 1600);
      },
      () => showToast("Failed to copy reply"),
    );
  }

  const showStarters = messages.length === 1 && !loading;

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:bg-black/20" />

          <DialogPrimitive.Content
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              window.setTimeout(() => textareaRef.current?.focus(), 60);
            }}
            className="fixed inset-y-2.5 right-2.5 left-2.5 z-50 flex flex-col overflow-hidden rounded-2xl border border-border/90 bg-background/95 text-foreground shadow-[0_24px_80px_-16px_rgba(0,0,0,0.45)] backdrop-blur-xl outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-6 data-[state=closed]:duration-150 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-6 data-[state=open]:duration-200 sm:inset-y-4 sm:right-4 sm:left-auto sm:w-[430px]"
          >
            {/* Polished Personal Header */}
            <header className="flex items-center justify-between gap-3 border-b border-border/80 bg-card/85 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-end justify-center overflow-hidden rounded-full border border-brand/50 bg-muted/60">
                  <Image
                    src="/avatar/milan-avatar-nav-v5.png"
                    alt={`${hero.name} AI companion avatar`}
                    width={40}
                    height={40}
                    className="h-9 w-auto object-contain object-bottom"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <DialogPrimitive.Title className="truncate font-display text-sm font-bold tracking-tight text-foreground">
                      {hero.name}
                    </DialogPrimitive.Title>
                    <span className="inline-flex items-center gap-1 rounded-full border border-brand/35 bg-brand/10 px-2 py-0.5 font-space-mono text-[9px] font-semibold uppercase tracking-wider text-brand">
                      <Sparkles className="h-2.5 w-2.5" />
                      {mode === "local" ? "AI Twin" : "AI Companion"}
                    </span>
                  </div>
                  <DialogPrimitive.Description className="truncate font-space-mono text-[11px] text-muted-foreground">
                    {hero.position} · Portfolio Chat
                  </DialogPrimitive.Description>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={resetChat}
                  aria-label="New conversation"
                  title="New conversation"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <DialogPrimitive.Close
                  aria-label="Close AI companion"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-background text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-90"
                >
                  <X className="h-4 w-4" />
                </DialogPrimitive.Close>
              </div>
            </header>

            {/* Quick Utility Strip */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border/60 bg-muted/25 px-4 py-2 font-space-mono text-[11px]">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-muted-foreground transition-all duration-150 hover:border-brand hover:text-foreground active:scale-95"
              >
                <Copy className="h-3 w-3 text-brand" />
                <span>{hero.email}</span>
              </button>
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 font-medium text-brand transition-all duration-150 hover:bg-brand hover:text-brand-foreground active:scale-95"
                >
                  <FileText className="h-3 w-3" />
                  <span>Resume</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Conversation Feed */}
            <div
              ref={scrollRef}
              aria-live="polite"
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.map((turn, idx) => {
                const isUser = turn.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col animate-in fade-in-0 slide-in-from-bottom-2 duration-200 ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`group/msg relative max-w-[90%] px-3.5 py-2.5 ${
                        isUser
                          ? "rounded-2xl rounded-tr-sm border border-brand/40 bg-brand/14 text-foreground shadow-xs"
                          : "rounded-2xl rounded-tl-sm border border-border/80 bg-card/90 text-muted-foreground shadow-xs"
                      }`}
                    >
                      <FormattedMessage text={turn.text} />

                      {!isUser && idx > 0 && (
                        <div className="mt-2 flex justify-end border-t border-border/50 pt-1.5">
                          <button
                            type="button"
                            onClick={() => copyReply(idx, turn.text)}
                            className="inline-flex items-center gap-1 font-space-mono text-[10px] text-muted-foreground transition-colors hover:text-brand active:scale-95"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <Check className="h-3 w-3 text-brand" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {showStarters && (
                <div className="space-y-2 pt-1 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
                  <p className="font-space-mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Suggested questions
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {starterPrompts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => void sendMessage(item.prompt)}
                        className="group/starter flex items-center gap-3 rounded-xl border border-border/80 bg-card/70 px-3 py-2.5 text-left transition-all duration-150 hover:border-brand hover:bg-brand/8 active:scale-[0.98]"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background transition-colors group-hover/starter:border-brand/50">
                          <StarterIcon id={item.id} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-space-mono text-[10px] uppercase tracking-wider text-brand">
                            {item.category}
                          </p>
                          <p className="truncate text-xs font-medium text-foreground">
                            {item.label}
                          </p>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-hover/starter:translate-x-0.5 group-hover/starter:-translate-y-0.5 group-hover/starter:text-brand" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-start animate-in fade-in-0 slide-in-from-bottom-1 duration-150">
                  <div className="inline-flex items-center gap-2.5 rounded-2xl rounded-tl-sm border border-border/80 bg-card/90 px-3.5 py-2.5">
                    <span
                      className="flex items-center gap-1"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.25s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand [animation-delay:-0.12s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" />
                    </span>
                    <span className="font-space-mono text-[11px] text-muted-foreground">
                      Typing...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(input);
              }}
              className="border-t border-border/80 bg-card/85 p-3"
            >
              <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-colors focus-within:border-brand">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHAT_MESSAGE_LENGTH}
                  onChange={(event) => {
                    setInput(event.target.value);
                    resizeTextarea(event.target);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage(input);
                    }
                  }}
                  placeholder="Ask me about my projects, stack, or getting in touch..."
                  aria-label={`Chat with ${hero.name}'s AI companion`}
                  disabled={loading}
                  className="max-h-28 min-h-[24px] flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-all duration-150 hover:opacity-90 active:scale-90 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between px-1 font-space-mono text-[10px] text-muted-foreground">
                <span>Enter to send · strictly scoped to portfolio</span>
                <span className="tabular-nums">
                  {input.length}/{MAX_CHAT_MESSAGE_LENGTH}
                </span>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Prominent Bottom-Right Avatar Launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-label={`Open ${hero.firstName}'s AI Companion`}
          className="group/aibtn fixed right-3.5 bottom-3.5 z-40 inline-flex h-11 items-center gap-2.5 rounded-full border border-brand/50 bg-background/95 pr-4 pl-1.5 font-space-mono text-xs text-foreground shadow-[0_12px_36px_-8px_rgba(0,0,0,0.35)] backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-200 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_14px_40px_-8px_color-mix(in_oklch,var(--brand)_45%,transparent)] active:translate-y-0 active:scale-95 sm:right-6 sm:bottom-5"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-end justify-center overflow-hidden rounded-full border border-brand/50 bg-muted/60">
            <Image
              src="/avatar/milan-avatar-nav-v5.png"
              alt=""
              width={32}
              height={32}
              className="h-7 w-auto object-contain object-bottom transition-transform duration-200 group-hover/aibtn:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute right-0 bottom-0 h-2 w-2 rounded-full border border-background bg-emerald-500"
            />
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            <span>Ask AI</span>
          </span>
        </button>
      )}
    </>
  );
}
