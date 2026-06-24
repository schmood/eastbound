/* Stay.jsx — a stay's detail / confirmation card. CONF holds the per-stop
   check-in details and a slot for the confirmation PDF (drop the file in the
   server's data/confirmations/ and set its path below). */
import { useParams, Navigate } from "react-router-dom";
import { STOPS } from "../data/stops.js";
import { LODGING } from "../data/lodging.js";
import { openNav, openMaps } from "../lib/nav.js";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Pill, placeLabel } from "../components/ui.jsx";

// confirmation extras — fill these in as confirmation emails arrive.
// pdf: null = not yet added (a file dropped at /confirmations/<id>.pdf shows here).
const CONF = {
  ottawa:      { conf: "—", checkIn: "4:00 PM", checkOut: "11:00 AM", address: "Downtown Ottawa", phone: "", pdf: null },
  quebec:      { conf: "—", checkIn: "4:00 PM", checkOut: "10:00 AM", address: "Old Québec (Le 201)", phone: "", pdf: null },
  fredericton: { conf: "—", checkIn: "4:00 PM", checkOut: "11:00 AM", address: "659 Queen St, Fredericton", phone: "", pdf: null },
  pei:         { conf: "—", checkIn: "3:00 PM", checkOut: "10:00 AM", address: "New Glasgow, PEI", phone: "", pdf: null },
  capebreton:  { conf: "—", checkIn: "3:00 PM", checkOut: "10:00 AM", address: "Petit Étang, NS", phone: "", pdf: null },
  halifax:     { conf: "—", checkIn: "4:00 PM", checkOut: "12:00 PM", address: "Downtown Halifax", phone: "", pdf: null },
  edmundston:  { conf: "—", checkIn: "3:00 PM", checkOut: "11:00 AM", address: "Edmundston, NB", phone: "", pdf: null },
  montreal:    { conf: "—", checkIn: "—", checkOut: "—", address: "Montréal — to book", phone: "", pdf: null }
};

function ConfRow({ k, val, mono }) {
  return (
    <div className="conf-row">
      <span className="conf-k">{k}</span>
      <span className={"conf-v" + (mono ? " mono" : "")}>{val}</span>
    </div>
  );
}

export default function Stay() {
  const { id } = useParams();
  const v = LODGING.stops[id];
  const stop = STOPS[id];
  if (!v || !stop) return <Navigate to="/stays" replace />;

  const c = CONF[id] || {};
  const booked = v.status === "booked";
  const b = v.booked;
  const findName = booked ? b.name : stop.name;

  return (
    <Screen title={stop.name} sub={v.dates} showBack>
      <div className="card">
        <div className="stay-detail__head">
          <Pill kind={booked ? "booked" : "tobook"} />
          <div className="stay-card__place">{placeLabel(stop.name, stop.province)}</div>
          <div className="stay-card__name">{booked ? b.name : "Hotel — still to book"}</div>
        </div>
        <div className="stay-card__detail">{booked ? b.detail : (v.intro || "")}</div>
        <div className="stay-card__dates">
          <Icon name="cal" />{v.dates} · {v.nights === 1 ? "1 night" : v.nights + " nights"}
        </div>
        <div className="stay-card__actions">
          <button className="btn btn--nav" onClick={() => openNav({ name: findName + " " + stop.province, coord: stop.coord })}>
            <Icon name="nav" />Directions
          </button>
          {c.phone
            ? <a className="btn btn--ghost" href={"tel:" + c.phone}><Icon name="phone" />Call</a>
            : <button className="btn btn--ghost" onClick={() => openMaps(findName)}><Icon name="pin" />Find</button>}
        </div>
      </div>

      {booked ? (
        <>
          <SectionTitle>Confirmation</SectionTitle>
          <div className="card">
            <div className="conf-rows">
              <ConfRow k="Property" val={b.name} />
              <ConfRow k="Type" val={b.type} />
              <ConfRow k="Check-in" val={v.dates.split("–")[0].trim() + " · " + (c.checkIn || "—")} />
              <ConfRow k="Check-out" val={c.checkOut || "—"} />
              <ConfRow k="Guests" val="2 adults + 2 (15, 13)" />
              <ConfRow k="Confirmation #" val={c.conf || "—"} mono />
              <ConfRow k="Total paid" val={"$" + Number(b.total).toLocaleString("en-CA")} />
            </div>
            <div className="pdf-slot">
              {c.pdf
                ? <a className="btn btn--primary btn--block" href={c.pdf} target="_blank" rel="noreferrer"><Icon name="doc" />Open confirmation PDF</a>
                : <><b>Confirmation PDF</b>Drop the email PDF at <code>server/data/confirmations/{id}.pdf</code> and set its path in CONF.</>}
            </div>
          </div>
        </>
      ) : (
        <>
          <SectionTitle>Still to book</SectionTitle>
          <div className="card">
            <div className="stay-card__detail" style={{ marginTop: 0 }}>Estimate <b>{v.est || ""}</b> for the stay.</div>
            <a className="btn btn--primary btn--block" style={{ marginTop: 14 }} href={v.searchUrl} target="_blank" rel="noreferrer">
              {(v.searchLabel || "Search stays") + " →"}
            </a>
          </div>
        </>
      )}
    </Screen>
  );
}
