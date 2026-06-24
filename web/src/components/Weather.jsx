/* Weather.jsx — the 3-day forecast card (Today) and the single-day chip (Day). */
import { Icon } from "../lib/icons.jsx";
import { SectionTitle } from "./ui.jsx";
import { getForecast, getDayWeather, wxIconName, wxLabel, wxClass } from "../lib/weather.js";

export function ForecastCard({ startIdx, loc }) {
  const f = getForecast(startIdx);
  if (!f) return null;
  const { now, days } = f;
  return (
    <>
      <SectionTitle>{"Weather" + (loc ? " · " + loc : "")}</SectionTitle>
      <div className="card wx">
        <div className="wx-now">
          <div className={"wx-now-ic " + wxClass(now.cond)}><Icon name={wxIconName(now.cond)} /></div>
          <div className="wx-now-temp">{now.hi}°<span>/ {now.lo}°</span></div>
          <div className="wx-now-meta"><b>{wxLabel(now.cond)}</b><span>{now.pop}% rain · wind {now.wind} km/h</span></div>
        </div>
        {now.note && <div className="wx-note-line">{now.note}</div>}
        <div className="wx-3day">
          {days.map((d, i) => (
            <div className="wx-d" key={i}>
              <span className="wx-dn">{d.dn}</span>
              <Icon name={wxIconName(d.cond)} className="wx-di" />
              <span className="wx-dt">{d.hi}°<i>{d.lo}°</i></span>
            </div>
          ))}
        </div>
        <div className="wx-sample">Sample forecast — live data once we’re closer</div>
      </div>
    </>
  );
}

export function WeatherChip({ idx }) {
  const w = getDayWeather(idx);
  if (!w) return null;
  return (
    <div className={"wx-chip " + wxClass(w.cond)}>
      <Icon name={wxIconName(w.cond)} />
      <span className="wx-chip-t">{w.hi}° / {w.lo}°</span>
      <span className="wx-chip-c">{wxLabel(w.cond)}</span>
      <span className="wx-chip-p">{w.pop}% · {w.wind} km/h</span>
    </div>
  );
}
