/* Weather.jsx — the 3-day forecast card (Today) and the single-day chip (Day). */
import { useState, useEffect } from "react";
import { Icon } from "../lib/icons.jsx";
import { SectionTitle } from "./ui.jsx";
import { getDayWeather, wxIconName, wxLabel, wxClass, loadLiveForecast } from "../lib/weather.js";

export function ForecastCard() {
  const [wx, setWx] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | error

  useEffect(() => {
    let alive = true;
    loadLiveForecast()
      .then((r) => { if (!alive) return; if (r) { setWx(r); setState("ok"); } else setState("error"); })
      .catch(() => { if (alive) setState("error"); });
    return () => { alive = false; };
  }, []);

  if (state !== "ok" || !wx) {
    return (
      <>
        <SectionTitle>Weather</SectionTitle>
        <div className="card wx"><div className="wx-loading">
          {state === "loading" ? "Loading the forecast…" : "Forecast unavailable right now."}
        </div></div>
      </>
    );
  }

  const { current, days } = wx;
  return (
    <>
      <SectionTitle>{"Weather · " + current.city}</SectionTitle>
      <div className="card wx">
        <div className="wx-now">
          <div className={"wx-now-ic " + wxClass(current.cond)}><Icon name={wxIconName(current.cond)} /></div>
          <div className="wx-now-temp">{current.temp}°</div>
          <div className="wx-now-meta">
            <b>{wxLabel(current.cond)}</b>
            <span>H {current.hi}° · L {current.lo}°{current.pop != null ? " · " + current.pop + "% rain" : ""}</span>
          </div>
        </div>
        <div className="wx-7day">
          {days.map((d, i) => (
            <div className="wx-d" key={i}>
              <span className="wx-dn">{d.dn}</span>
              <Icon name={wxIconName(d.cond)} className="wx-di" />
              <span className="wx-dt">{d.hi}°<i>{d.lo}°</i></span>
              <span className="wx-city">{d.city}</span>
            </div>
          ))}
        </div>
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
