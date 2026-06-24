/* TabBar.jsx — the five bottom tabs. Day/Stay detail screens keep their parent
   tab (Days / Stays) highlighted. */
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../lib/icons.jsx";

const TABS = [
  { id: "today", label: "Today", icon: "today", to: "/today" },
  { id: "days",  label: "Days",  icon: "route", to: "/days" },
  { id: "stays", label: "Stays", icon: "bed",   to: "/stays" },
  { id: "notes", label: "Journal", icon: "note", to: "/notes" },
  { id: "stats", label: "Stats", icon: "chart", to: "/stats" }
];

function activeTab(pathname) {
  const p = pathname.replace(/^\//, "");
  if (p.indexOf("day") === 0) return "days";   // days, day/:idx
  if (p.indexOf("stay") === 0) return "stays"; // stays, stay/:id
  if (p.indexOf("notes") === 0) return "notes";
  if (p.indexOf("stats") === 0) return "stats";
  return "today";
}

export function TabBar() {
  const { pathname } = useLocation();
  const active = activeTab(pathname);
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <Link key={t.id} to={t.to} className={"tab" + (t.id === active ? " active" : "")}>
          <Icon name={t.icon} /><span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
