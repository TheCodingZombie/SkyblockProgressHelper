
import {
    HashRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import PlayerLookupPage from "./pages/PlayerLookupPage";
import PlayerDashboard from "./pages/PlayerDashboard";
import SkillPage from "./pages/SkillPage";

import { skills } from "./config/skills";

import {
    PlayerProvider,
    usePlayer
} from "./context/PlayerContext";

function AppContent() {
    const { player } = usePlayer();

    return (
        <div className="app">
            {player && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={player ? "/dashboard" : "/lookup"}
                            replace
                        />
                    }
                />

                <Route
                    path="/lookup"
                    element={
                        player
                            ? <Navigate to="/dashboard" replace />
                            : <PlayerLookupPage />
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        player
                            ? <PlayerDashboard />
                            : <Navigate to="/lookup" replace />
                    }
                />

                {Object.values(skills).map(skill => (
                    <Route
                        key={skill.id}
                        path={`/${skill.id}`}
                        element={
                            player
                                ? <SkillPage skill={skill} />
                                : <Navigate to="/lookup" replace />
                        }
                    />
                ))}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={player ? "/dashboard" : "/lookup"}
                            replace
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <HashRouter>
            <PlayerProvider>
                <AppContent />
            </PlayerProvider>
        </HashRouter>
    );
}
