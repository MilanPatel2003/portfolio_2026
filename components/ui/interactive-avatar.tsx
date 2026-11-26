"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const GREETINGS = [
  "Hey! Thanks for visiting 👋",
  "React · Node.js · PostgreSQL",
  "Let's build something cool!",
  "Open to exciting roles 🚀",
] as const;

export function InteractiveAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<HTMLDivElement>(null);
  const rightPupilRef = useRef<HTMLDivElement>(null);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showGreeting, setShowGreeting] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    let rafId = 0;
    let pointer: { x: number; y: number } | null = null;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      rafId = 0;
      const container = containerRef.current;
      const leftPupil = leftPupilRef.current;
      const rightPupil = rightPupilRef.current;
      if (!container || !leftPupil || !rightPupil) return;

      let targetX = 0;
      let targetY = 0;

      if (pointer) {
        const rect = container.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width * 0.5;
        const eyeCenterY = rect.top + rect.height * 0.421;
        const dx = pointer.x - eyeCenterX;
        const dy = pointer.y - eyeCenterY;

        const normX = Math.max(-1, Math.min(1, dx / 260));
        const normY = Math.max(-1, Math.min(1, dy / 220));
        const maxOffsetX = rect.width * 0.0145;
        const maxOffsetY = rect.height * 0.0055;

        targetX = normX * maxOffsetX;
        targetY = normY * maxOffsetY;
      }

      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;

      const transform = `translate3d(calc(-50% + ${currentX.toFixed(2)}px), calc(-50% + ${currentY.toFixed(2)}px), 0)`;
      leftPupil.style.transform = transform;
      rightPupil.style.transform = transform;

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!rafId) rafId = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };

    const onReset = () => {
      pointer = null;
      schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onReset);
    document.documentElement.addEventListener("pointerleave", onReset);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onReset);
      document.documentElement.removeEventListener("pointerleave", onReset);
    };
  }, []);

  function handleClick() {
    setShowGreeting(true);
    setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowGreeting(false), 3500);
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Interactive speech bubble */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none mb-2 border border-brand/50 bg-popover px-3 py-1 font-mono text-xs text-popover-foreground shadow-md transition-all duration-200 ${
          showGreeting
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1.5 scale-95 opacity-0"
        }`}
      >
        <span>{GREETINGS[greetingIndex]}</span>
      </div>

      {/* Interactive 3D bust with behind-mask cursor-tracking pupils */}
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => {
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          setShowGreeting(true);
        }}
        onMouseLeave={() => setShowGreeting(false)}
        aria-label="Interactive developer avatar — click to cycle greeting"
        className="group relative cursor-pointer transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <div
          ref={containerRef}
          className="relative h-56 w-56 origin-bottom transition-transform duration-300 ease-out group-hover:scale-[1.02] sm:h-64 sm:w-64"
        >
          {/* Ambient glow behind avatar */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-4 bottom-0 h-32 rounded-full opacity-35 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
            style={{
              background:
                "radial-gradient(circle, var(--brand) 0%, transparent 72%)",
            }}
          />

          {/* Left eye sclera + pupil + blink (z-0..z-20, oversized stage cleanly behind avatar mask z-30) */}
          <div
            aria-hidden="true"
            className="avatar-eye-socket absolute z-0"
            style={{
              left: "35.53%",
              top: "38.89%",
              width: "10.0%",
              height: "6.4%",
              background:
                "linear-gradient(180deg, #ccc5be 0%, #f6f2ee 38%, #ebe5df 100%)",
            }}
          >
            <div
              ref={leftPupilRef}
              className="avatar-pupil absolute top-1/2 left-1/2 z-10 aspect-square w-[38%] rounded-full"
              style={{
                transform: "translate3d(-50%, -50%, 0)",
                background:
                  "radial-gradient(circle at 46% 44%, #3c2416 0%, #1d0f08 58%, #0d0704 100%)",
              }}
            >
              <span className="absolute top-1/2 left-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#090503]" />
              <span className="absolute top-[18%] right-[19%] h-[24%] w-[24%] rounded-full bg-white/95" />
            </div>
            <span
              className="avatar-blink-lid pointer-events-none absolute inset-0 z-20 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #b88163 0%, #ce9b7c 80%, #9b6a50 100%)",
              }}
            />
          </div>

          {/* Right eye sclera + pupil + blink (z-0..z-20, oversized stage cleanly behind avatar mask z-30) */}
          <div
            aria-hidden="true"
            className="avatar-eye-socket absolute z-0"
            style={{
              left: "53.89%",
              top: "38.89%",
              width: "10.0%",
              height: "6.4%",
              background:
                "linear-gradient(180deg, #ccc5be 0%, #f6f2ee 38%, #ebe5df 100%)",
            }}
          >
            <div
              ref={rightPupilRef}
              className="avatar-pupil absolute top-1/2 left-1/2 z-10 aspect-square w-[38%] rounded-full"
              style={{
                transform: "translate3d(-50%, -50%, 0)",
                background:
                  "radial-gradient(circle at 46% 44%, #3c2416 0%, #1d0f08 58%, #0d0704 100%)",
              }}
            >
              <span className="absolute top-1/2 left-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#090503]" />
              <span className="absolute top-[18%] right-[19%] h-[24%] w-[24%] rounded-full bg-white/95" />
            </div>
            <span
              className="avatar-blink-lid pointer-events-none absolute inset-0 z-20 origin-top"
              style={{
                background:
                  "linear-gradient(180deg, #b88163 0%, #ce9b7c 80%, #9b6a50 100%)",
              }}
            />
          </div>

          {/* Foreground avatar cutout with transparent eye holes (z-30) */}
          <Image
            src="/avatar/milan-avatar-interactive-v4.png"
            alt="Milan Patel 3D developer avatar"
            width={256}
            height={256}
            sizes="(max-width: 640px) 224px, 256px"
            className="pointer-events-none relative z-30 h-full w-full object-contain"
          />
        </div>
      </button>
    </div>
  );
}
