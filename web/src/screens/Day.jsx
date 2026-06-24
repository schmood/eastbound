/* Day.jsx — a single day's detail: navigate CTA, weather chip, drive, sunset,
   the ordered plan with per-stop directions, where we sleep, and the day's notes. */
import { useParams, Navigate } from "react-router-dom";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { LODGING } from "../data/lodging.js";
import { parseD, WDL, MO } from "../lib/dates.js";
import { openNav } from "../lib/nav.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Pill } from "../components/ui.jsx";
import { WeatherChip } from "../components/Weather.jsx";
import { DriveCard, SunsetBanner, StayCardCompact } from "../components/trip-bits.jsx";
import { NotesSection } from "../components/Notes.jsx";

export default function Day() {
  const { idx } = useParams();
  const i = parseInt(idx, 10);
  if (isNaN(i) || !DAYS[i]) return <Navigate to="/days" replace />;

  const day = DAYS[i];
  const dd = parseD(day.date);
  const sub = WDL[dd.getDay()] + ", " + MO[dd.getMonth()] + " " + dd.getDate();
  const v = day.base !== "home" ? LODGING.stops[day.base] : null;

  return (
    <Screen title={"Day " + (i + 1)} sub={sub} showBack>
      {day.waypoint && (
        <button className="btn btn--nav btn--block" style={{ margin: "4px 0 14px" }} onClick={() => openNav(day.waypoint)}>
          <Icon name="nav" />{"Navigate: " + day.waypoint.name}
        </button>
      )}

      <WeatherChip idx={i} />
      {day.drive && <DriveCard drive={day.drive} />}
      {day.sunset && <SunsetBanner sunset={day.sunset} />}

      <div className="card"><div className="dd-plan">
        {day.plan.map((p, k) => (
          <div className="dd-item" key={k}>
            <div className="dd-time">{p.time}</div>
            <div className="dd-body">
              <div className="dd-title">{p.title}{p.tag && <Pill kind={p.tag} />}</div>
              {p.note && <div className="dd-note">{p.note}</div>}
              {p.geo && (
                <a className="dd-navlink" onClick={() => openNav(p.geo)}>
                  <Icon name="nav" />Directions to {p.geo.name}
                </a>
              )}
            </div>
          </div>
        ))}
      </div></div>

      {v && (
        <>
          <SectionTitle>Where we sleep</SectionTitle>
          <StayCardCompact baseId={day.base} v={v} />
        </>
      )}

      <NotesSection date={day.date} />
    </Screen>
  );
}
