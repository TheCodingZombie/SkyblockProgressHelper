
import { Pickaxe, TrendingUp, Coins } from "lucide-react";

import { MINING_CONTEXTS } from "../config/miningContexts";

import "../styles/miningOverview.css";

function formatStat(value) {
    return Number(value ?? 0).toLocaleString();
}

export default function MiningOverview({
    miningStats,
    selectedContext
}) {
    const context = MINING_CONTEXTS.find(
        entry => entry.id === selectedContext
    );

    if (!miningStats || !context) {
        return null;
    }

    const displayedStats = context.stats;

    return (
        <div className="mining-overview-grid">

            {/* Current Mining Stats */}
            <section className="dashboard-panel mining-stats-panel">

                <div className="section-heading">
                    <h2>Mining Stats</h2>
                    <Pickaxe size={20} />
                </div>

                <p className="muted-text mining-context-description">
                    {context.description}
                </p>

                <div className="mining-stat-grid">

                    {displayedStats.map(stat => (
                        <div
                            className="mining-stat-card"
                            key={stat}
                        >
                            <span>{stat}</span>

                            <strong>
                                {formatStat(
                                    miningStats.totals[stat]
                                )}
                            </strong>
                        </div>
                    ))}

                </div>

                {/* Source contributions */}
                <div className="mining-contributions">

                    <h3>Stat Contributions</h3>

                    {Object.entries(miningStats.sources).map(
                        ([source, stats]) => {
                            const relevantStats =
                                displayedStats
                                    .map(stat => ({
                                        name: stat,
                                        value: stats[stat] ?? 0
                                    }))
                                    .filter(
                                        stat => stat.value !== 0
                                    );

                            if (relevantStats.length === 0) {
                                return null;
                            }

                            return (
                                <details
                                    className="mining-source-group"
                                    key={source}
                                >
                                    <summary>
                                        <span>
                                            {source.charAt(0).toUpperCase() +
                                                source.slice(1)}
                                        </span>

                                        <span className="source-stat-count">
                                            {relevantStats.length} stats
                                        </span>
                                    </summary>

                                    <div className="mining-source-details">

                                        {relevantStats.map(stat => (
                                            <div
                                                className="mining-source-row"
                                                key={stat.name}
                                            >
                                                <span>{stat.name}</span>

                                                <strong>
                                                    +{formatStat(stat.value)}
                                                </strong>
                                            </div>
                                        ))}

                                    </div>
                                </details>
                            );
                        }
                    )}

                </div>

            </section>


            {/* Future Mining Rates */}
            <section className="dashboard-panel mining-rates-panel">

                <div className="section-heading">
                    <h2>Mining Rates</h2>
                    <Coins size={20} />
                </div>

                <p className="muted-text">
                    Estimated rates for your selected mining context.
                </p>

                <div className="mining-rates-placeholder">

                    <TrendingUp size={36} />

                    <h3>Mining Rates Coming Soon</h3>

                    <p>
                        This section will eventually calculate
                        estimated items per hour, coins per hour,
                        and other efficiency metrics.
                    </p>

                </div>

            </section>

        </div>
    );
}
