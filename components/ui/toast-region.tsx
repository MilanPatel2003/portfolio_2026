"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

type ToastState = {
  id: number;
  message: string;
} | null;

export function ToastRegion() {
  const [toast, setToast] = useState<ToastState>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    const onToast = (event: CustomEvent<{ message: string }>) => {
      const nextMessage = event.detail?.message;
      if (!nextMessage) return;
      seqRef.current += 1;
      setToast({ id: seqRef.current, message: nextMessage });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setToast(null), 2200);
    };

    window.addEventListener("portfolio:toast", onToast as EventListener);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("portfolio:toast", onToast as EventListener);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed top-20 left-1/2 z-[60] -translate-x-1/2 sm:top-22"
    >
      {toast && (
        <div
          key={toast.id}
          className="inline-flex items-center gap-2 rounded-full border border-brand/60 bg-popover px-3.5 py-1.5 font-space-mono text-xs text-popover-foreground shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-150"
        >
          <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
          <span className="whitespace-nowrap">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
