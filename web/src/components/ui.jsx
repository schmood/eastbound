/* ui.jsx — small presentational primitives shared across screens. */
import { useState } from "react";
import { Icon } from "../lib/icons.jsx";

export function SectionTitle({ children }) {
  return <h2 className="section-h">{children}</h2>;
}

// status pills. Presets match the prototype; pass children for a plain pill.
export function Pill({ kind, children }) {
  if (kind === "booked") return <span className="pill pill--booked"><Icon name="check" />Booked</span>;
  if (kind === "tobook") return <span className="pill pill--tobook">To book</span>;
  if (kind === "stay")   return <span className="pill pill--stay">Check-in</span>;
  if (kind === "drive")  return <span className="pill pill--drive">Drive</span>;
  return <span className="pill">{children}</span>;
}

export function Avatar({ person, size, className }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (!person) return null;
  const sz = size === "lg" ? " avatar--lg" : size === "xl" ? " avatar--xl" : "";
  const cls = "avatar" + sz + (className ? " " + className : "");
  // a photo if the person has one (web/src/data/people.js → `avatar`); on a
  // missing/broken image, fall back to the coloured initials.
  if (person.avatar && !imgFailed) {
    return <img className={cls + " avatar--img"} src={person.avatar} alt={person.name || ""} onError={() => setImgFailed(true)} />;
  }
  return (
    <span className={cls} style={{ background: person.color }}>
      {person.initials}
    </span>
  );
}

// thin progress bar used across the stats screens
export function Bar({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return <div className="st-bar"><span style={{ width: pct + "%" }} /></div>;
}

// "Ottawa · Ontario" unless the name already carries the province
export function placeLabel(name, province) {
  return province && province !== name ? name + " · " + province : name;
}
