/* icons.jsx — the line-icon set, carried over verbatim from the prototype.
   <Icon name="nav" /> renders the matching 24×24 stroke SVG. Paths are trusted
   static strings, so dangerouslySetInnerHTML is safe here. */

export const ICON = {
  today: '<path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M4 9h16M9 3v3M15 3v3"/><circle cx="12" cy="14" r="2.2"/>',
  route: '<circle cx="5" cy="6.5" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="5" cy="17.5" r="1.4"/><path d="M9.5 6.5h10M9.5 12h10M9.5 17.5h10"/>',
  road: '<path d="M8 21 5 3h4l1 18M16 21l3-18h-4l-1 18M12 6v2M12 12v2M12 18v1.5"/>',
  bed: '<path d="M3 8v11M3 13h18a0 0 0 0 1 0 0v6M21 19v-5a3 3 0 0 0-3-3H8"/><circle cx="6.5" cy="9.5" r="1.6"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5.9 1.2.9 1.9v.2h5.2v-.2c0-.7.3-1.4.9-1.9A6 6 0 0 0 12 3Z"/>',
  pin: '<path d="M12 21s-6.5-6-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15 12 21 12 21Z"/><circle cx="12" cy="10.5" r="2.3"/>',
  nav: '<path d="m3 11 18-8-8 18-2-8-8-2Z"/>',
  car: '<path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Z"/><circle cx="8" cy="15.5" r="0"/>',
  cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 9h16M9 3v3M15 3v3"/>',
  check: '<path d="M4 12.5 9 17.5 20 6"/>',
  phone: '<path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5 5L19 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5M9 13h6M9 16h6"/>',
  sun: '<circle cx="12" cy="13" r="4"/><path d="M12 3v2M5 7 6.5 8.5M19 7l-1.5 1.5M3 14h2M19 14h2M12 19c-3 0-9 .5-9 2h18c0-1.5-6-2-9-2Z"/>',
  cam: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7l1.5-2.5h5L16 7"/><circle cx="12" cy="13.5" r="3.2"/>',
  wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  cloud: '<path d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.8 3.8 0 0 1 18 18H7Z"/>',
  wsun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.4M12 19v2.4M2.6 12h2.4M19 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7"/>',
  wpartly: '<circle cx="8.5" cy="7.5" r="2.8"/><path d="M8.5 2.4v1.5M3.4 7.5h1.5M4.6 4.6l1 1M12.4 4.6l-1 1"/><path d="M7 19a3.2 3.2 0 0 1-.2-6.4 4 4 0 0 1 7.7-1A3 3 0 0 1 17.5 19H7Z"/>',
  wrain: '<path d="M7 15a3.6 3.6 0 0 1 0-7.2 4.6 4.6 0 0 1 8.8-1.2A3.5 3.5 0 0 1 17 15H7Z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
  wfog: '<path d="M6.5 13a3.6 3.6 0 0 1 0-7.2 4.6 4.6 0 0 1 8.8-1.2A3.5 3.5 0 0 1 16.5 13"/><path d="M4 16.5h16M6 20h12"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="M9 12l2 2 4-4"/>',
  anchor: '<circle cx="12" cy="6" r="2.4"/><path d="M12 8.4V20M5 13a7 7 0 0 0 14 0M5 13H3m16 0h2"/>',
  chart: '<path d="M5 19V5M5 19h14M9 16V11M13 16V8M17 16v-3"/>',
  send: '<path d="M4.5 12h13M11 5.5 17.5 12 11 18.5"/>',
  swap: '<path d="M7 4 3.5 7.5 7 11M3.5 7.5H16M17 20l3.5-3.5L17 13M20.5 16.5H8"/>',
  out: '<path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8 6 12l4 4M6 12h11"/>',
  note: '<path d="M5 4h11l3 3v13a0 0 0 0 1 0 0H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 14h6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.3"/>'
};

export function Icon({ name, className }) {
  var p = ICON[name] || "";
  return <svg viewBox="0 0 24 24" className={className} dangerouslySetInnerHTML={{ __html: p }} />;
}
