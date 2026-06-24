/* Days.jsx — the full itinerary list. Today is highlighted; past days dim. */
import { Link } from "react-router-dom";
import { useTrip } from "../trip.jsx";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { parseD, WD, MO } from "../lib/dates.js";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Pill } from "../components/ui.jsx";

export default function Days() {
  const { today } = useTrip();
  return (
    <Screen title="Itinerary" sub="Kitchener → the Maritimes → home">
      <SectionTitle>{"17 nights · " + DAYS.length + " days"}</SectionTitle>
      <div className="daylist">
        {DAYS.map((day, i) => {
          const d = parseD(day.date);
          let cls = "dayrow";
          if (day.date === today) cls += " is-today";
          else if (day.date < today) cls += " is-past";
          const drive = day.kind === "drive" || day.kind === "transit";
          const hasBooked = day.plan.some((p) => p.tag === "booked");
          const hasTobook = day.plan.some((p) => p.tag === "tobook");
          return (
            <Link className={cls} to={"/day/" + i} key={i}>
              <div className="dayrow__date">
                <div className="dayrow__dow">{WD[d.getDay()]}</div>
                <div className="dayrow__dd">{d.getDate()}</div>
                <div className="dayrow__mon">{MO[d.getMonth()]}</div>
              </div>
              <div className="dayrow__body">
                <div className="dayrow__t">{day.title}</div>
                <div className="dayrow__s">{day.summary}</div>
                {(drive || hasBooked || hasTobook) && (
                  <div className="dayrow__tags">
                    {drive && <Pill kind="drive" />}
                    {hasBooked && <Pill kind="booked" />}
                    {hasTobook && <Pill kind="tobook" />}
                  </div>
                )}
              </div>
              <div className="dayrow__chev">›</div>
            </Link>
          );
        })}
      </div>
    </Screen>
  );
}
