/* SimBar.jsx — the day-stepper, shown only when simulation mode is on (a
   setting in Account). Lets us preview the on-the-road experience on any day. */
import { useNavigate } from "react-router-dom";
import { useTrip } from "../trip.jsx";
import { tripState, daysUntil, parseD, MO } from "../lib/dates.js";

export function SimBar() {
  const { simOn, today, isSimulating, stepSim, resetSim } = useTrip();
  const nav = useNavigate();
  if (!simOn) return null;

  const st = tripState(today);
  let label;
  if (st.phase === "before") label = daysUntil(today) + "d pre-trip";
  else if (st.phase === "after") label = "Post-trip";
  else { const d = parseD(today); label = "Day " + (st.idx + 1) + " · " + MO[d.getMonth()] + " " + d.getDate(); }

  const step = (dir) => { stepSim(dir); nav("/today"); };
  const reset = () => { resetSim(); nav("/today"); };

  return (
    <div className="simbar">
      <button onClick={() => step(-1)}>‹ Prev</button>
      <span className="sim-day">{(isSimulating ? "Simulating: " : "Live · ") + label}</span>
      <button onClick={() => step(1)}>Next ›</button>
      {isSimulating && <button className="sim-reset" onClick={reset}>live</button>}
    </div>
  );
}
