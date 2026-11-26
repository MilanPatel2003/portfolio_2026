"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ObserverCallback = () => void;

let sharedObserver: IntersectionObserver | null = null;
const observedElements = new WeakMap<Element, ObserverCallback>();

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight) {
            const cb = observedElements.get(entry.target);
            if (cb) {
              observedElements.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
              cb();
            }
          }
        }
      },
      { threshold: 0.03, rootMargin: "0px 0px -24px 0px" },
    );
  }
  return sharedObserver;
}

/** A file in the same workspace, rather than a separate terminal window. */
export function WorkspaceFile({
  id,
  title,
  filename,
  type = "MD",
  action,
  className = "",
  children,
}: {
  id: string;
  title: string;
  filename: string;
  type?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealState, setRevealState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Only animate sections initially below the fold so LCP & anchor jumps never flicker
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96) {
      return;
    }

    const observer = getSharedObserver();
    if (!observer) return;

    const rafId = window.requestAnimationFrame(() => {
      const currentRect = el.getBoundingClientRect();
      if (currentRect.top < window.innerHeight * 0.96) return;
      setRevealState("hidden");
      observedElements.set(el, () => setRevealState("visible"));
      observer.observe(el);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observedElements.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      data-reveal={revealState}
      className={`workspace-section workspace-file workspace-reveal ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <header className="workspace-file-header">
        <span aria-hidden="true" className="text-brand">
          {type}
        </span>
        <h2 id={`${id}-heading`}>{title}</h2>
        <span className="workspace-file-path">{filename}</span>
        {action && (
          <div className="w-full min-w-0 sm:ml-auto sm:w-auto">{action}</div>
        )}
      </header>
      <div className="workspace-file-body flex-1">{children}</div>
    </section>
  );
}
