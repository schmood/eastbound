/* trip-bits.jsx — reusable trip cards: the drive card, sunset banner, a compact
   stay card, a plan row (Today), the pre-trip mini-route, and the stats teaser. */
import { Link } from "react-router-dom";
import { Icon } from "../lib/icons.jsx";
import { Pill, Bar } from "./ui.jsx";
import { openNav } from "../lib/nav.js";
import { STOPS } from "../data/stops.js";
import { computeStats } from "../lib/stats.js";
import { fmtKm } from "../lib/dates.js";

export function DriveCard({ drive, style }) {
  return (
    <div className="drivecard" style={style}>
      <div className="drivecard__ic"><Icon name="car" /></div>
      <div className="drivecard__main">
        <div className="drivecard__route">{drive.from} → {drive.to}</div>
        <div className="drivecard__stat">{drive.km} · {drive.hrs}</div>
      </div>
    </div>
  );
}

export function SunsetBanner({ sunset, text }) {
  return (
    <div className="sunset">
      <Icon name="sun" />
      <span>{text || ("Sunset " + sunset + " — golden-hour Skyline hike.")}</span>
    </div>
  );
}

export function PlanRow({ p }) {
  return (
    <div className="nn-row">
      <div className="nn-time">{p.time}</div>
      <div className="nn-body">
        <div className="nn-title">{p.title}{p.tag && <Pill kind={p.tag} />}</div>
        {p.note && <div className="nn-note">{p.note}</div>}
        {p.geo && (
          <div className="nn-nav">
            <button className="btn btn--ghost" onClick={() => openNav(p.geo)}><Icon name="nav" />{p.geo.name}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function StayCardCompact({ baseId, v }) {
  const booked = v.status === "booked";
  const name = booked ? v.booked.name : "Hotel — still to book";
  const detail = booked ? v.booked.detail : (v.intro || "");
  return (
    <Link className="card stay-card" to={"/stay/" + baseId}>
      <div className="stay-card__top">
        <div>
          <div className="stay-card__place">{STOPS[baseId].name}</div>
          <div className="stay-card__name">{name}</div>
        </div>
        <Pill kind={booked ? "booked" : "tobook"} />
      </div>
      {detail && <div className="stay-card__detail">{detail}</div>}
      <div className="stay-card__dates"><Icon name="cal" />{v.dates}</div>
    </Link>
  );
}

export function MiniRoute({ trip }) {
  return (
    <div className="card"><div className="dd-plan">
      {trip.stops.map((s, i) => (
        <div className="dd-item" key={s.id}>
          <div className="dd-time">{s.shortRange}</div>
          <div className="dd-body">
            <div className="dd-title">{(i + 1) + ". " + s.name}</div>
            <div className="dd-note">{s.tag} · {s.nights}</div>
          </div>
        </div>
      ))}
    </div></div>
  );
}

export function StatsTeaser({ today }) {
  const s = computeStats(today);
  let line;
  if (s.phase === "before") line = "Starts in " + s.untilStart + (s.untilStart === 1 ? " day" : " days");
  else if (s.phase === "after") line = "Trip complete · " + fmtKm(s.kmTotal) + " km";
  else line = "Day " + s.daysDone + " of " + s.totalDays + " · " + fmtKm(s.kmDone) + " of " + fmtKm(s.kmTotal) + " km";
  return (
    <Link className="card st-teaser" to="/stats">
      <div className="st-teaser__ic"><Icon name="chart" /></div>
      <div className="st-teaser__b">
        <div className="st-teaser__t">Trip stats</div>
        <div className="st-teaser__s">{line}</div>
        <Bar done={s.daysDone} total={s.totalDays} />
      </div>
      <div className="st-teaser__go">›</div>
    </Link>
  );
}
