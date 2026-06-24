/* Account.jsx — who you're signed in as, log out, a journal shortcut + export,
   and the simulation-mode toggle. */
import { Link } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { useNotes } from "../notes.jsx";
import { useTrip } from "../trip.jsx";
import { Icon } from "../lib/icons.jsx";
import { Screen } from "../components/Screen.jsx";
import { SectionTitle, Avatar } from "../components/ui.jsx";

export default function Account() {
  const { user, logout } = useAuth();
  const { allCount, myCount, downloadNotes } = useNotes();
  const { simOn, setSimEnabled } = useTrip();
  if (!user) return null;

  return (
    <Screen title="Account" sub={user.name} showBack>
      <div className="card me-card">
        <Avatar person={user} size="xl" />
        <div className="me-b">
          <div className="me-name">{user.name}</div>
        </div>
      </div>

      <button className="btn btn--ghost btn--block" style={{ marginBottom: 18 }} onClick={logout}>
        <Icon name="out" />Log out
      </button>

      <SectionTitle>Trip journal</SectionTitle>
      <Link className="card st-teaser" to="/notes">
        <div className="st-teaser__ic"><Icon name="note" /></div>
        <div className="st-teaser__b">
          <div className="st-teaser__t">All notes</div>
          <div className="st-teaser__s">{allCount + (allCount === 1 ? " note" : " notes")} · {myCount} from you</div>
        </div>
        <div className="st-teaser__go">›</div>
      </Link>
      <button className="btn btn--primary btn--block" style={{ marginTop: 6 }} onClick={downloadNotes}>
        <Icon name="doc" />Export notes as text
      </button>

      <SectionTitle>Settings</SectionTitle>
      <div className="card set-row">
        <div className="set-b">
          <div className="set-t">Simulation mode</div>
          <div className="set-d">Show the day-stepper bar to preview any day of the trip. Off for normal use.</div>
        </div>
        <button
          className={"toggle" + (simOn ? " on" : "")}
          role="switch" aria-checked={simOn ? "true" : "false"} aria-label="Toggle simulation mode"
          onClick={() => setSimEnabled(!simOn)}
        >
          <span className="toggle__dot" />
        </button>
      </div>

      <p className="about-note">
        Signed in on this device. Notes you add are tagged with your name and the time, and sync to everyone’s phones through the shared family journal.
      </p>
    </Screen>
  );
}
