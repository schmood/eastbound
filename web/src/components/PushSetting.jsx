/* PushSetting.jsx — the "daily trip facts" notification toggle on the Account
   screen. Enables/disables the 9 AM Web Push for this device and can fire a
   test. iOS needs the app added to the Home Screen first. */
import { useState, useEffect } from "react";
import { SectionTitle } from "./ui.jsx";
import { getPushState, enablePush, disablePush, isStandalone, isIOS } from "../lib/push.js";
import { api } from "../lib/api.js";

export function PushSetting() {
  const [state, setState] = useState("loading"); // loading|unsupported|denied|on|off
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { getPushState().then(setState).catch(() => setState("unsupported")); }, []);

  const iosNeedsInstall = isIOS() && !isStandalone();

  const toggle = async () => {
    setBusy(true); setMsg("");
    try {
      if (state === "on") { await disablePush(); setState("off"); }
      else { await enablePush(); setState("on"); setMsg("You're in — a fun fact lands at 9 AM."); }
    } catch (e) { setMsg(e.message || "Something went wrong."); }
    setBusy(false);
  };

  const sendTest = async () => {
    setBusy(true); setMsg("");
    try {
      const r = await api.testPush();
      setMsg(r && r.sent ? "Test sent — check your notifications." : "Sent, but no devices are subscribed yet.");
    } catch (e) { setMsg("Couldn't send a test right now."); }
    setBusy(false);
  };

  const desc =
    state === "on" ? "On — a countdown fun fact each morning at 9." :
    state === "denied" ? "Blocked in your browser/phone settings — re-allow notifications for this site to turn it on." :
    state === "unsupported" ? "This browser can't show notifications." :
    "Get a fun fact about the trip every morning at 9 AM.";

  return (
    <>
      <SectionTitle>Daily trip facts</SectionTitle>
      <div className="card">
        <div className="set-row">
          <div className="set-b">
            <div className="set-t">9 AM fun fact</div>
            <div className="set-d">{desc}</div>
          </div>
          {(state === "on" || state === "off") && (
            <button
              className={"toggle" + (state === "on" ? " on" : "")}
              role="switch" aria-checked={state === "on" ? "true" : "false"}
              aria-label="Toggle daily trip facts" disabled={busy} onClick={toggle}>
              <span className="toggle__dot" />
            </button>
          )}
        </div>
        {state === "off" && iosNeedsInstall && (
          <div className="set-d" style={{ marginTop: 10 }}>
            On iPhone: add Eastbound to your Home Screen first (Share → Add to Home Screen), open it from there, then turn this on.
          </div>
        )}
        {state === "on" && (
          <a className="dd-navlink" style={{ marginTop: 12 }} onClick={sendTest}>Send a test notification</a>
        )}
        {msg && <div className="set-d" style={{ marginTop: 10 }}>{msg}</div>}
      </div>
    </>
  );
}
