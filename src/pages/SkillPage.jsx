
import {
    Pickaxe,
    Trees,
    Fish,
    TrendingUp,
    User
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

import { useCallback, useEffect, useState } from "react";
import { getMiningStats } from "../services/miningService";

import "../styles/skillPage.css";

import MiningConsumableSettings from "../components/MiningConsumableSettings";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};

export default function SkillPage({ skill }) {

    const { player, clearPlayer } = usePlayer();

    const [miningConsumables, setMiningConsumables] = useState({});

    const handleMiningConsumablesChange = useCallback((counts) => {
        setMiningConsumables(counts);
    }, []);

    const Icon = skillIcons[skill.id];

    const [miningStats, setMiningStats] = useState(null);
    const [miningLoading, setMiningLoading] = useState(false);
    const [miningError, setMiningError] = useState("");

    useEffect(() => {
        if (skill.id !== "mining" || !player) {
            return;
        }

        let cancelled = false;

        async function loadMiningStats() {
            setMiningLoading(true);
            setMiningError("");

            try {
                const result = await getMiningStats(
                    player.profileId,
                    player.uuid,
                    miningConsumables
                );

                if (!cancelled) {
                    setMiningStats(result);
                }
            } catch (error) {
                if (!cancelled) {
                    setMiningError(error.message);
                    setMiningStats(null);
                }
            } finally {
                if (!cancelled) {
                    setMiningLoading(false);
                }
            }
        }

        loadMiningStats();

        return () => {
            cancelled = true;
        };

    }, [
        skill.id,
        player?.uuid,
        player?.profileId,
        miningConsumables
    ]);

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

            {skill.id === "mining" && (
                <MiningConsumableSettings
                    key={`${player.uuid}-${player.profileId}`}
                    playerUUID={player.uuid}
                    profileId={player.profileId}
                    onChange={handleMiningConsumablesChange}
                />
            )}

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

            {skill.id === "mining" && (
                <section className="dashboard-panel">

                    <div className="section-heading">
                        <h2>Mining Statistics</h2>
                        <Pickaxe size={20} />
                    </div>

                    {miningLoading && (
                        <p className="muted-text">
                            Calculating Mining statistics...
                        </p>
                    )}

                    {miningError && (
                        <p className="error-text">
                            {miningError}
                        </p>
                    )}

                    {!miningLoading && !miningError && miningStats && (
                        <>
                            <div className="stat-grid">
                                {Object.entries(miningStats.totals).map(
                                    ([stat, value]) => (
                                        <div className="stat-card" key={stat}>
                                            <span>{stat}</span>
                                            <strong>
                                                {Number(value).toLocaleString()}
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>

                            <h3>Stat Sources</h3>

                            <div className="mining-source-grid">
                                {Object.entries(miningStats.sources).map(
                                    ([source, stats]) => (
                                        <div
                                            className="mining-source-card"
                                            key={source}
                                        >
                                            <h4>
                                                {source.charAt(0).toUpperCase() +
                                                    source.slice(1)}
                                            </h4>

                                            {Object.entries(stats).map(
                                                ([stat, value]) => (
                                                    <div
                                                        className="mining-source-row"
                                                        key={stat}
                                                    >
                                                        <span>{stat}</span>
                                                        <strong>
                                                            {Number(value).toLocaleString()}
                                                        </strong>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            <h3>Conditional Bonuses</h3>

                            {Object.entries(miningStats.conditional).map(
                                ([category, bonuses]) => (
                                    <div key={category}>
                                        <h4>
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </h4>

                                        {Object.entries(bonuses).map(
                                            ([condition, stats]) => (
                                                <div
                                                    className="mining-source-card"
                                                    key={condition}
                                                >
                                                    <strong>{condition}</strong>

                                                    {Object.entries(stats).map(
                                                        ([stat, value]) => (
                                                            <div
                                                                className="mining-source-row"
                                                                key={stat}
                                                            >
                                                                <span>{stat}</span>
                                                                <strong>
                                                                    +{Number(value).toLocaleString()}
                                                                </strong>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )
                            )}
                        </>
                    )}

                </section>
            )}

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
