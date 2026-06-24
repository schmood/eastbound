/* Stats.jsx — the running trip tally: progress hero, stat tiles, provinces
   crossed, and a few fun facts. Updates to the current (or simulated) day. */
import { useTrip } from "../trip.jsx";
import { computeStats } from "../lib/stats.js";
import { fmtKm } from "../lib/dates.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Bar } from "../components/ui.jsx";

function StatTile({ value, total, unit, label, done, of }) {
  return (
    <div className="st-tile">
      <div className="st-val">
        {value}
        {total != null && <span className="st-of">/ {total}</span>}
        {unit && <span className="st-unit">{unit}</span>}
      </div>
      <div className="st-lab">{label}</div>
      <Bar done={done} total={of} />
    </div>
  );
}

function FactRow({ icon, big, label }) {
  return (
    <div className="st-fact">
      <div className="st-fact__ic"><Icon name={icon} /></div>
      <div className="st-fact__b"><b>{big}</b><span>{label}</span></div>
    </div>
  );
}

export default function Stats() {
  const { today } = useTrip();
  const s = computeStats(today);

  let heroTitle, heroSub;
  if (s.phase === "before") { heroTitle = "The road ahead"; heroSub = s.untilStart + (s.untilStart === 1 ? " day" : " days") + " until we roll out"; }
  else if (s.phase === "after") { heroTitle = "Trip complete"; heroSub = "Here’s the final tally"; }
  else { heroTitle = "Day " + s.daysDone + " of " + s.totalDays; heroSub = s.daysLeft + (s.daysLeft === 1 ? " day to go" : " days to go"); }
  const pct = Math.round((s.daysDone / s.totalDays) * 100);

  return (
    <Screen title="Trip stats" sub={heroSub} showBack>
      <div className="st-hero">
        <div className="st-hero__pct">{pct}<span>%</span></div>
        <div className="st-hero__body">
          <div className="st-hero__t">{heroTitle}</div>
          <div className="st-hero__s">{heroSub}</div>
          <Bar done={s.daysDone} total={s.totalDays} />
        </div>
      </div>

      <div className="st-grid">
        <StatTile value={fmtKm(s.kmDone)} total={fmtKm(s.kmTotal)} unit=" km" label="Distance driven" done={s.kmDone} of={s.kmTotal} />
        <StatTile value={s.nightsDone} total={s.totalNights} label="Nights away" done={s.nightsDone} of={s.totalNights} />
        <StatTile value={s.provDone} total={s.prov.length} label="Provinces" done={s.provDone} of={s.prov.length} />
        <StatTile value={s.stopsDone} total={s.stopsTotal} label="Stops reached" done={s.stopsDone} of={s.stopsTotal} />
      </div>

      <SectionTitle>Provinces crossed</SectionTitle>
      <div className="st-prov">
        {s.prov.map((p) => (
          <div className={"st-chip" + (p.done ? " on" : "")} key={p.abbr}><b>{p.abbr}</b><span>{p.name}</span></div>
        ))}
      </div>

      <SectionTitle>Tally</SectionTitle>
      <div className="card"><div className="st-facts">
        <FactRow icon="car" big={s.drivesDone + " of " + s.drivesTotal} label="driving legs done" />
        <FactRow icon="road" big={fmtKm(s.kmTotal - s.kmDone) + " km"} label="still to drive" />
        <FactRow icon="chart" big={s.biggest + " km"} label="longest single leg (Halifax → Edmundston)" />
        <FactRow icon="anchor" big={s.idx >= 8 ? "Crossed ✓" : "Aug 6"} label="Wood Islands → Caribou ferry" />
      </div></div>

      <p className="about-note">A running tally, updated to today. Fun for the back seat.</p>
    </Screen>
  );
}
