"use client";
// ─────────────────────────────────────────────────────────────────────────────
// AvidToast.jsx
// Drop this file into your components folder.
// Usage: import { Toaster, toast } from './AvidToast'
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const TOKENS = {
  success: {
    header: "#15803d",
    label: "Confirmed",
    autoHide: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.25" stroke="white" strokeWidth="1.5" />
        <path d="M4.5 8.5L6.5 10.5L11.5 5.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    header: "#b91c1c",
    label: "Error",
    autoHide: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.25" stroke="white" strokeWidth="1.5" />
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    header: "#b45309",
    label: "Warning",
    autoHide: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6.5V9.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="white" />
      </svg>
    ),
  },
  info: {
    header: "#1a5fab",
    label: "Access Required",
    autoHide: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7.25" stroke="white" strokeWidth="1.5" />
        <circle cx="8" cy="5.5" r="0.75" fill="white" />
        <path d="M8 7.5V11.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
};

const DismissIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1 1L10 10M10 1L1 10" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

function getTimestamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

function Toast({ id, type, message, direction, onDismiss, duration = 6000 }) {
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(100);
  const [timestamp] = useState(getTimestamp());
  const hoveredRef  = useRef(false);
  const startRef    = useRef(null);
  const spentRef    = useRef(0);
  const intervalRef = useRef(null);
  const timerRef    = useRef(null);
  const t = TOKENS[type] || TOKENS.info;

  useEffect(() => {
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
  }, []);

  const clearTimers = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timerRef.current);
  };

  const startCountdown = useCallback(() => {
    if (!t.autoHide) return;
    startRef.current = Date.now();
    const remaining = duration - spentRef.current;

    intervalRef.current = setInterval(() => {
      if (hoveredRef.current) return;
      const total = spentRef.current + (Date.now() - startRef.current);
      setProgress(Math.max(0, 100 - (total / duration) * 100));
    }, 16);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(id), 340);
    }, remaining);
  }, [duration, id, onDismiss, t.autoHide]);

  useEffect(() => {
    startCountdown();
    return clearTimers;
  }, []);

  const handleMouseEnter = () => {
    if (!t.autoHide) return;
    spentRef.current += Date.now() - (startRef.current || Date.now());
    hoveredRef.current = true;
    clearTimers();
  };

  const handleMouseLeave = () => {
    if (!t.autoHide) return;
    hoveredRef.current = false;
    startCountdown();
  };

  const dismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(id), 340);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: visible ? "translateX(0) scale(1)" : "translateX(calc(100% + 24px)) scale(0.97)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.36s cubic-bezier(0.22,1,0.36,1), opacity 0.24s ease",
        width: "340px",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.07)",
        border: `1px solid ${t.header}28`,
        fontFamily: FONT,
        cursor: "default",
      }}
    >
      {/* Header */}
      <div style={{ background: t.header, padding: "9px 11px 9px 13px", display: "flex", alignItems: "center", gap: "9px" }}>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{t.icon}</div>
        <span style={{ flex: 1, fontSize: "13px", fontWeight: "600", color: "#fff", fontFamily: FONT }}>
          {t.label}
        </span>
        <button
          onClick={dismiss}
          aria-label="Dismiss notification"
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "3px", borderRadius: "4px", display: "flex", alignItems: "center", transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
        >
          <DismissIcon />
        </button>
      </div>

      {/* Body */}
      <div style={{ background: "#fff", padding: "11px 13px 12px", borderTop: `1px solid ${t.header}18` }}>
        <p style={{ margin: 0, fontSize: "12.5px", fontWeight: "400", color: "#1f2937", lineHeight: "1.55", fontFamily: FONT }}>
          {message}
        </p>
        {direction && (
          <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: type === "info" ? "#1a5fab" : type === "warning" ? "#b45309" : "#1f2937", fontWeight: 500, fontFamily: FONT }}>
            {direction}
          </p>
        )}
        <p style={{ margin: "5px 0 0", fontSize: "10.5px", color: "rgba(0,0,0,0.38)", fontFamily: FONT }}>
          {timestamp}
        </p>
      </div>

      {/* Progress bar — success and info only */}
      {t.autoHide && (
        <div style={{ height: "2px", background: `${t.header}18` }}>
          <div style={{ height: "100%", width: `${progress}%`, background: t.header, opacity: 0.4, transition: "width 16ms linear" }} />
        </div>
      )}
    </div>
  );
}

// ─── Toast Manager ────────────────────────────────────────────────────────────

let _toastId = 0;
let _addToast = null;

// Accepts: toast.info(main, direction?)
export const toast = {
  success: (message) => _addToast?.({ id: ++_toastId, type: "success", message }),
  error:   (message) => _addToast?.({ id: ++_toastId, type: "error",   message }),
  warning: (message, direction) => _addToast?.({ id: ++_toastId, type: "warning", message, direction }),
  info:    (message, direction) => _addToast?.({ id: ++_toastId, type: "info",    message, direction }),
};

// ─── Toaster — mount once in your root layout ─────────────────────────────────

export function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (t) => setToasts((prev) => [...prev, t]);
    return () => { _addToast = null; };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "9px",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <Toast {...t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
