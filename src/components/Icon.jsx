export function Icon({ name, className = "" }) {
  const baseProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `icon ${className}`.trim(),
    style: { width: "20px", height: "20px" },
    "aria-hidden": true
  };

  switch (name) {
    case "home":
      return <svg {...baseProps}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>;
    case "users":
      return <svg {...baseProps}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="3" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a3 3 0 0 1 0 5.75" /></svg>;
    case "factory":
      return <svg {...baseProps}><path d="M3 21V8l6 3V8l6 3V4l6 3v14Z" /></svg>;
    case "box":
      return <svg {...baseProps}><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="m3 7 9 4 9-4" /><path d="M12 11v10" /><path d="M3 7v10l9 4 9-4V7" /></svg>;
    case "truck":
      return <svg {...baseProps}><path d="M1 6h12v10H1z" /><path d="M13 9h5l3 3v4h-8z" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>;
    case "user":
      return <svg {...baseProps}><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0 1 13 0" /></svg>;
    case "download":
      return <svg {...baseProps}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></svg>;
    case "cash":
      return <svg {...baseProps}><rect x="2.5" y="5.5" width="19" height="13" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M2.5 10A3.5 3.5 0 0 0 6 6.5" /><path d="M21.5 14A3.5 3.5 0 0 1 18 17.5" /></svg>;
    case "history":
      return <svg {...baseProps}><path d="M3 12a9 9 0 1 0 2.64-6.36" /><path d="M3 4v4h4" /><path d="M12 7v5l3 2" /></svg>;
    case "briefcase":
      return <svg {...baseProps}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a3 3 0 0 1 6 0v2" /></svg>;
    case "clipboard":
      return <svg {...baseProps}><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5h6a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 9 4.5Z" /></svg>;
    case "rotate":
      return <svg {...baseProps}><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v4h4" /></svg>;
    case "plus":
      return <svg {...baseProps}><path d="M12 5v14" /><path d="M5 12h14" /></svg>;
    case "edit":
      return <svg {...baseProps}><path d="M12 20h9" /><path d="m16.5 3.5 4 4L8 20l-5 1 1-5Z" /></svg>;
    case "trash":
      return <svg {...baseProps}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></svg>;
    case "wallet":
      return <svg {...baseProps}><path d="M3 7a2 2 0 0 1 2-2h14v14H5a2 2 0 0 1-2-2Z" /><path d="M19 10h2v4h-2a2 2 0 1 1 0-4Z" /></svg>;
    default:
      return <svg {...baseProps}><circle cx="12" cy="12" r="2" /></svg>;
  }
}
