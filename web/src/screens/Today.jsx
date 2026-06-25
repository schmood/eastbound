/* Today.jsx — the home screen. Pre-trip it's a countdown + route preview; on the
   trip it's the day's hero, navigation, drive, weather, plan, tonight's stay,
   and the day's notes. Date-aware via the trip context (real or simulated). */
import { Link } from "react-router-dom";
import { useTrip } from "../trip.jsx";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { STOPS, expandTrip } from "../data/stops.js";
import { LODGING } from "../data/lodging.js";
import { tripState, daysUntil, fullDate, WD, parseD } from "../lib/dates.js";
import { openNav } from "../lib/nav.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle } from "../components/ui.jsx";
import { ForecastCard } from "../components/Weather.jsx";
import { DriveCard, SunsetBanner, PlanRow, StayCardCompact, MiniRoute, StatsTeaser } from "../components/trip-bits.jsx";
import { NotesSection } from "../components/Notes.jsx";

const TRIP = expandTrip();

export default function Today() {
  const { today } = useTrip();
  const st = tripState(today);

  if (st.phase === "before") {
    const n = daysUntil(today);
    const d0 = DAYS[0];
    return (
      <Screen title="Eastbound" sub="Maritimes road trip">
        <div className="card countdown">
          <div className="countdown__num">{n}</div>
          <div className="countdown__lab">{n === 1 ? "day" : "days"} to departure</div>
          <div className="countdown__sub">We roll out <b>{fullDate(d0.date)}</b> — {d0.title}.</div>
        </div>
        <ForecastCard />
        <SectionTitle>The route at a glance</SectionTitle>
        <MiniRoute trip={TRIP} />
        <StatsTeaser today={today} />
      </Screen>
    );
  }

  const day = DAYS[st.idx];
  const dayNum = st.idx + 1;
  const base = day.base;
  const v = base !== "home" ? LODGING.stops[base] : null;
  const driveTag = day.kind === "drive" || day.kind === "transit";
  const navHome = base === "home" && st.phase === "after";

  return (
    <Screen title="Eastbound" sub={"Day " + dayNum}>
      <div className="hero-day">
        <div className="hero-day__kicker">
          <span>{st.phase === "after" ? "Trip complete" : "Today"}</span>
          <span>{WD[parseD(today).getDay()]}</span>
        </div>
        <div className="hero-day__date">{fullDate(today)}</div>
        <h1>{day.title}</h1>
        <div className="hero-day__sum">{day.summary}</div>
        <div className="hero-day__meta">
          <span className="pill">Day {dayNum} of {DAYS.length}</span>
          {driveTag && day.drive && <span className="pill"><Icon name="car" /> {day.drive.hrs}</span>}
          {v && <span className="pill"><Icon name="bed" /> {STOPS[base].name}</span>}
        </div>
      </div>

      {day.waypoint && (
        <button className="btn btn--nav btn--block" style={{ marginBottom: 8 }} onClick={() => openNav(day.waypoint)}>
          <Icon name="nav" />{navHome ? "Navigate home" : "Navigate: " + day.waypoint.name}
        </button>
      )}

      {day.drive && <DriveCard drive={day.drive} style={{ marginTop: 6 }} />}
      {day.sunset && <SunsetBanner text={"Sunset " + day.sunset + " — Skyline check-in by 6 PM for the golden-hour hike."} />}

      <ForecastCard />

      <SectionTitle>Today’s plan</SectionTitle>
      <div className="card"><div className="nownext">
        {day.plan.map((p, i) => <PlanRow key={i} p={p} />)}
      </div></div>

      {v && (
        <>
          <SectionTitle>Tonight</SectionTitle>
          <StayCardCompact baseId={base} v={v} />
        </>
      )}

      <StatsTeaser today={today} />
      <NotesSection date={day.date} />
    </Screen>
  );
}
