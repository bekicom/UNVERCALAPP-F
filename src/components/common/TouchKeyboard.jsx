import { useEffect, useMemo, useRef, useState } from "react";

const TEXT_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

const NUM_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0"]
];

function isKeyboardTarget(el) {
  if (!el) return false;
  if (el.matches("[data-no-keyboard='true']")) return false;
  if (el.readOnly || el.disabled) return false;
  if (el.tagName === "TEXTAREA") return true;
  if (el.tagName !== "INPUT") return false;
  const type = String(el.type || "text").toLowerCase();
  if (["date", "datetime-local", "time", "month", "week", "color", "file"].includes(type)) return false;
  return true;
}

function setNativeValue(el, value) {
  const proto = el.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export function TouchKeyboard({ enabled = true }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("text");
  const targetRef = useRef(null);
  const keepFocus = (e) => e.preventDefault();

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      targetRef.current = null;
      return;
    }

    const onFocusIn = (e) => {
      const el = e.target;
      if (!isKeyboardTarget(el)) return;
      targetRef.current = el;
      const t = String(el.type || "").toLowerCase();
      const inputMode = String(el.inputMode || "").toLowerCase();
      setMode(
        t === "number" ||
        t === "tel" ||
        inputMode === "decimal" ||
        inputMode === "numeric"
          ? "number"
          : "text"
      );
      setOpen(true);
    };

    document.addEventListener("focusin", onFocusIn);
    return () => document.removeEventListener("focusin", onFocusIn);
  }, [enabled]);

  const rows = useMemo(() => (mode === "number" ? NUM_ROWS : TEXT_ROWS), [mode]);

  const typeChars = (chars) => {
    const el = targetRef.current;
    if (!el) return;
    const current = String(el.value || "");
    const type = String(el.type || "").toLowerCase();
    if ((type === "number" || type === "tel") && chars === "." && current.includes(".")) {
      el.focus();
      return;
    }
    const start = Number.isFinite(el.selectionStart) ? el.selectionStart : current.length;
    const end = Number.isFinite(el.selectionEnd) ? el.selectionEnd : start;
    const next = `${current.slice(0, start)}${chars}${current.slice(end)}`;
    setNativeValue(el, next);
    const pos = start + chars.length;
    try { el.setSelectionRange(pos, pos); } catch {}
    el.focus();
  };

  const backspace = () => {
    const el = targetRef.current;
    if (!el) return;
    const current = String(el.value || "");
    let start = Number.isFinite(el.selectionStart) ? el.selectionStart : current.length;
    const end = Number.isFinite(el.selectionEnd) ? el.selectionEnd : start;

    let next = current;
    if (start !== end) {
      next = `${current.slice(0, start)}${current.slice(end)}`;
    } else if (start > 0) {
      next = `${current.slice(0, start - 1)}${current.slice(start)}`;
      start -= 1;
    }
    setNativeValue(el, next);
    try { el.setSelectionRange(start, start); } catch {}
    el.focus();
  };

  const clearAll = () => {
    const el = targetRef.current;
    if (!el) return;
    setNativeValue(el, "");
    try { el.setSelectionRange(0, 0); } catch {}
    el.focus();
  };

  if (!open) return null;

  return (
    <div className="touchkbd-backdrop" onClick={() => setOpen(false)}>
      <section className="touchkbd-card" onClick={(e) => e.stopPropagation()}>
        <div className="touchkbd-head">
          <strong>Ekran klaviaturasi</strong>
          <div className="touchkbd-head-actions">
            <button type="button" className="ghost" onMouseDown={keepFocus} onClick={clearAll}>Tozalash</button>
            <button type="button" className="ghost" onMouseDown={keepFocus} onClick={() => setOpen(false)}>Yopish</button>
          </div>
        </div>

        <div className={`touchkbd-grid ${mode === "number" ? "num" : ""}`}>
          {rows.map((row, i) => (
            <div className="touchkbd-row" key={i}>
              {row.map((k) => (
                <button type="button" key={k} onMouseDown={keepFocus} onClick={() => typeChars(k)}>{k}</button>
              ))}
            </div>
          ))}
          {mode === "text" ? (
            <div className="touchkbd-row">
              <button type="button" className="wide" onMouseDown={keepFocus} onClick={() => typeChars(" ")}>Bo'shliq</button>
              <button type="button" className="ghost" onMouseDown={keepFocus} onClick={backspace}>⌫</button>
            </div>
          ) : (
            <div className="touchkbd-row">
              <button type="button" className="ghost" onMouseDown={keepFocus} onClick={backspace}>⌫</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
