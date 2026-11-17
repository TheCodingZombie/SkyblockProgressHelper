
import {
    Pickaxe,
    Trees,
    Fish,
    TrendingUp,
    User
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

import "../styles/skillPage.css";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

export default function SkillPage({ skill }) {

    const { player, clearPlayer } = usePlayer();

    const Icon = skillIcons[skill.id];

    return (
        <main className="skill-page">

            {/* Page heading */}
            <header className="skill-header">

                <div
                    className="skill-icon"
                    style={{ color: skill.color }}
                >
                    <Icon size={36} />
                </div>

                <div>
                    <h1>{skill.name}</h1>
                    <p>{skill.description}</p>
                </div>

            </header>


            {/* Selected player */}
            <section className="dashboard-panel">

                <div className="section-heading">
                    <h2>Selected Player</h2>

                    <User size={20} />
                </div>

                <div className="player-info">

                    <strong>{player.username}</strong>

                    <button
                        className="change-player-button"
                        onClick={clearPlayer}
                    >
                        Change Player
                    </button>

                </div>

                <p className="muted-text">
                    Currently analyzing {skill.name} progression.
                </p>

            </section>


            {/* Statistics */}
            <section className="dashboard-panel">

                <div className="section-heading">
                    <h2>Skill Statistics</h2>
                    <TrendingUp size={20} />
                </div>

                <div className="stat-grid">

                    <div className="stat-card">
                        <span>Skill Level</span>
                        <strong>--</strong>
                    </div>

                    <div className="stat-card">
                        <span>Total XP</span>
                        <strong>--</strong>
                    </div>

                    <div className="stat-card">
                        <span>Next Level</span>
                        <strong>--</strong>
                    </div>

                </div>

            </section>


            {/* Recommendations */}
            <section className="dashboard-panel">

                <h2>Recommended Upgrades</h2>

                <p className="muted-text">
                    Upgrade recommendations will appear here
                    once player information is loaded.
                </p>

            </section>

        </main>
    );
}
