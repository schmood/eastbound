/* App.jsx — providers + the phone shell + hash routing.
   Not signed in → the password gate (no tabs). Signed in → the app, wrapped in
   NotesProvider so the shared journal polls in the background on every screen. */
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth.jsx";
import { TripProvider } from "./trip.jsx";
import { NotesProvider } from "./notes.jsx";
import { TabBar } from "./components/TabBar.jsx";
import { SimBar } from "./components/SimBar.jsx";
import Login from "./screens/Login.jsx";
import Today from "./screens/Today.jsx";
import Days from "./screens/Days.jsx";
import Day from "./screens/Day.jsx";
import Stays from "./screens/Stays.jsx";
import Stay from "./screens/Stay.jsx";
import Stats from "./screens/Stats.jsx";
import Journal from "./screens/Journal.jsx";
import Account from "./screens/Account.jsx";

const mainStyle = { flex: 1, display: "flex", flexDirection: "column", minHeight: 0 };

function AppRoutes() {
  return (
    <Routes>
      <Route path="/today" element={<Today />} />
      <Route path="/days" element={<Days />} />
      <Route path="/day/:idx" element={<Day />} />
      <Route path="/stays" element={<Stays />} />
      <Route path="/stay/:id" element={<Stay />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/notes" element={<Journal />} />
      <Route path="/me" element={<Account />} />
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
}

function Shell() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="shell"><div className="phone">
        <div id="main" style={mainStyle}><Login /></div>
      </div></div>
    );
  }
  return (
    <NotesProvider>
      <div className="shell"><div className="phone">
        <div id="main" style={mainStyle}><AppRoutes /></div>
        <TabBar />
        <SimBar />
      </div></div>
    </NotesProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <HashRouter>
          <Shell />
        </HashRouter>
      </TripProvider>
    </AuthProvider>
  );
}
