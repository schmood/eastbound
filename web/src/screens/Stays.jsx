/* Stays.jsx — every lodging stop in route order, plus the booked tours/transport. */
import { Link } from "react-router-dom";
import { STOPS, expandTrip } from "../data/stops.js";
import { LODGING } from "../data/lodging.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Pill, placeLabel } from "../components/ui.jsx";

const TRIP = expandTrip();

export default function Stays() {
  return (
    <Screen title="Stays" sub="Confirmations & lodging">
      <SectionTitle>Where we’re staying</SectionTitle>
      {TRIP.stops.map((s) => {
        const v = LODGING.stops[s.id];
        if (!v) return null;
        const booked = v.status === "booked";
        return (
          <Link className="card stay-card" to={"/stay/" + s.id} key={s.id}>
            <div className="stay-card__top">
              <div>
                <div className="stay-card__place">{placeLabel(s.name, s.province)}</div>
                <div className="stay-card__name">{booked ? v.booked.name : "Hotel — still to book"}</div>
              </div>
              <Pill kind={booked ? "booked" : "tobook"} />
            </div>
            <div className="stay-card__detail">{booked ? v.booked.detail : (v.intro || "")}</div>
            <div className="stay-card__dates">
              <Icon name="cal" />{v.dates} · {v.nights === 1 ? "1 night" : v.nights + " nights"}
            </div>
          </Link>
        );
      })}

      <SectionTitle>Booked along the way</SectionTitle>
      {LODGING.extras.map((e) => (
        <div className="card" key={e.id}>
          <div className="stay-card__top">
            <div>
              <div className="stay-card__place">{e.kind}</div>
              <div className="stay-card__name" style={{ fontSize: "1.12rem" }}>{e.label}</div>
            </div>
            <Pill kind={e.status === "booked" ? "booked" : "tobook"} />
          </div>
          <div className="stay-card__detail">{e.when} — {e.note}</div>
        </div>
      ))}
    </Screen>
  );
}
