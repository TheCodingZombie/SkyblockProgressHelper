
import { useNavigate } from "react-router-dom";
import { Pickaxe, Trees, Fish } from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import { skills } from "../config/skills";

import PlayerProfileCard from "../components/PlayerProfileCard";
import TopUpgradeCard from "../components/TopUpgradeCard";

import "../styles/dashboard.css";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

// Temporary recommendations.
// We'll replace these with calculated recommendations later.
const exampleUpgrades = {
    mining: {
        name: "Improve Your Mining Equipment",
        description: "Your next mining upgrade could improve your overall mining efficiency.",
        benefit: "Mining progression"
    },
    foraging: {
        name: "Upgrade Your Foraging Tool",
        description: "Consider improving your tool to increase your foraging efficiency.",
        benefit: "Foraging progression"
    },
    fishing: {
        name: "Improve Your Fishing Setup",
        description: "A better fishing setup could help you progress more efficiently.",
        benefit: "Fishing progression"
    }
};

export default function PlayerDashboard() {
    const { player, clearPlayer } = usePlayer();
    const navigate = useNavigate();

    function handleChangePlayer() {
        clearPlayer();
        navigate("/");
    }

    return (
        <main className="dashboard-page">
            <header className="dashboard-heading">
                <div>
                    <span className="dashboard-eyebrow">
                        PLAYER OVERVIEW
                    </span>

                    <h1>Your Dashboard</h1>

                    <p>
                        Here's where your next SkyBlock upgrades begin.
                    </p>
                </div>
            </header>

            <div className="dashboard-layout">
                <div className="dashboard-player-column">
                    <PlayerProfileCard
                        player={player}
                        onChangePlayer={handleChangePlayer}
                    />
                </div>

                <div className="dashboard-upgrades-column">
                    <div className="dashboard-upgrade-list">
                        {Object.values(skills).map(skill => {
                            const Icon = skillIcons[skill.id];

                            return (
                                <TopUpgradeCard
                                    key={skill.id}
                                    skill={{ ...skill, icon: Icon }}
                                    upgrade={exampleUpgrades[skill.id]}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}
