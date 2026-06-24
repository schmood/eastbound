/* Journal.jsx — the whole shared journal, by day. Add to any day inline; after
   posting we scroll that day into view (it also appears on the day's page). */
import { Fragment, useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import { useTrip } from "../trip.jsx";
import { useNotes } from "../notes.jsx";
import { TRIP_DAYS as DAYS } from "../data/trip-days.js";
import { parseD, WD, MO } from "../lib/dates.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { NoteItem, NoteComposer } from "../components/Notes.jsx";

export default function Journal() {
  const { today } = useTrip();
  const { allCount, notesForDay, downloadNotes } = useNotes();
  const [scrollDate, setScrollDate] = useState(null);
  const topRef = useRef(null);

  useLayoutEffect(() => {
    if (!scrollDate) return;
    const scroller = topRef.current && topRef.current.closest(".screen");
    const anchor = document.getElementById("jr-" + scrollDate);
    if (scroller && anchor) {
      const top = anchor.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 8;
      scroller.scrollTop = Math.max(0, top);
    }
    setScrollDate(null);
  }, [scrollDate]);

  return (
    <Screen title="Trip journal" sub="Everyone’s notes, by day">
      <div ref={topRef} />
      <button className="btn btn--primary btn--block" style={{ margin: "4px 0 12px" }} onClick={downloadNotes}>
        <Icon name="doc" />Export all notes as text
      </button>
      <p className="jr-intro">
        {allCount + (allCount === 1 ? " note" : " notes")} so far. Add to any day below — it shows up on that day’s page too.
      </p>
      {DAYS.map((day, i) => {
        const dn = notesForDay(day.date);
        const d = parseD(day.date);
        const isToday = day.date === today;
        const isPast = day.date < today;
        return (
          <Fragment key={i}>
            <div className={"jr-day" + (isToday ? " is-today" : "")} id={"jr-" + day.date}>
              <span className="jr-day__d">
                {WD[d.getDay()] + " " + MO[d.getMonth()] + " " + d.getDate() + (isToday ? " · Today" : "")}
              </span>
              <Link className="jr-day__t" to={"/day/" + i}>{day.title}</Link>
            </div>
            <div className={"card notes" + (dn.length ? "" : " notes--empty")}>
              {dn.length
                ? <div className="note-list">{dn.map((n) => <NoteItem key={n.id} note={n} allowDelete />)}</div>
                : <div className="note-empty">{isPast ? "Nothing logged this day." : isToday ? "No notes yet today." : "Nothing here yet."}</div>}
              <NoteComposer date={day.date} onPosted={setScrollDate} />
            </div>
          </Fragment>
        );
      })}
    </Screen>
  );
}
