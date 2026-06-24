/* Login.jsx — the family-password gate. Enter the shared password, then tap who
   you are. The password is verified against the server once; the session then
   persists on-device. */
import { useState } from "react";
import { useAuth } from "../auth.jsx";
import { PEOPLE } from "../data/people.js";
import { Icon } from "../lib/icons.jsx";
import { Avatar } from "../components/ui.jsx";

export default function Login() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (person) => {
    if (busy) return;
    if (!password.trim()) { setError("Enter the family password, then tap your name."); return; }
    setBusy(true);
    setError("");
    const res = await login(password.trim(), person.id);
    setBusy(false);
    if (!res.ok) {
      setError(res.reason === "offline"
        ? "Can’t reach the trip server — try again when you have a connection."
        : "That’s not the family password. Try again.");
    }
    // on success the app re-renders into the signed-in view automatically
  };

  return (
    <div className="screen screen--login">
      <div className="login">
        <div className="login__logo"><Icon name="lock" /></div>
        <div className="login__brand">Eastbound</div>
        <div className="login__sub">Enter the family password, then tap your name</div>

        {error && <div className="login__err">{error}</div>}

        <div className="login__pw">
          <input
            type="password" autoComplete="current-password" placeholder="Family password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
        </div>

        <div className="login__divide"><span>who’s signing in?</span></div>
        <div className="login__list">
          {PEOPLE.map((p) => (
            <button className="login__acct" key={p.id} disabled={busy} onClick={() => submit(p)}>
              <Avatar person={p} size="lg" />
              <span className="login__acct-b"><b>{p.name}</b></span>
              <span className="login__chev">›</span>
            </button>
          ))}
        </div>

        <div className="login__note">
          A private family companion · Jul 29 – Aug 15, 2026<br />
          Only the four of us, behind one shared password.
        </div>
      </div>
    </div>
  );
}
