
import {
    Pickaxe,
    Trees,
    Fish,
    TrendingUp,
    User
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

import { useCallback, useEffect, useState, useMemo } from "react";
import { getMiningStats } from "../services/miningService";

import "../styles/skillPage.css";

import MiningContextSelector from "../components/MiningContextSelector";
import MiningOverview from "../components/MiningOverview";
import SkillStatBreakdown from "../components/SkillStatBreakdown";

const skillIcons = {
    mining: Pickaxe,
    foraging: Trees,
    fishing: Fish
};


function buildMiningSections(miningStats) {
    if (!miningStats) return [];

    const sources = miningStats.sources ?? {};
    const itemBreakdown = miningStats.itemBreakdown ?? {};
    const accessoryInfo = miningStats.accessoryInfo ?? {};

    return [
        {
            id: "armor",
            title: "Armor",
            items: itemBreakdown.armor ?? []
        },
        {
            id: "equipment",
            title: "Equipment",
            items: itemBreakdown.equipment ?? []
        },
        {
            id: "accessories",
            title: "Accessories",
            items: accessoryInfo.items ?? []
        },
        {
            id: "pet",
            title: "Pet",
            petInfo: miningStats.petInfo ?? null,
            aggregateStats: sources.pet ?? {}
        },
        {
            id: "hotm",
            title: "Heart of the Mountain",
            aggregateStats: sources.hotm ?? {}
        }
    ];
}


export default function SkillPage({ skill }) {

    const { player, clearPlayer } = usePlayer();

    const [miningConsumables, setMiningConsumables] = useState({});

    const handleMiningConsumablesChange = useCallback(
        counts => {
            setMiningConsumables(counts);
        },
        []
    );

    const Icon = skillIcons[skill.id];

    const [miningStats, setMiningStats] = useState(null);
    const [miningLoading, setMiningLoading] = useState(false);
    const [miningError, setMiningError] = useState("");
    const [selectedMiningContext, setSelectedMiningContext] = useState("crystalHollows");
    
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
                    {
                        oreOats: 0,
                        blockBran: 0,
                        gemstoneGrahams: 0,
                        metallicMinis: 0
                    }
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
        player?.profileId
    ]);

    const displayedMiningStats = useMemo(() => {
        if (!miningStats) return null;

        const consumableBonuses = {
            "Ore Fortune": (miningConsumables.oreOats ?? 0) * 2,
            "Block Fortune": (miningConsumables.blockBran ?? 0) * 2,
            "Gemstone Fortune": (miningConsumables.gemstoneGrahams ?? 0) * 2,
            "Dwarven Metal Fortune": (miningConsumables.metallicMinis ?? 0) * 2
        };

        const totals = {
            ...miningStats.totals
        };

        const sources = {
            ...miningStats.sources,
            consumables: {}
        };

        for (const [stat, bonus] of Object.entries(consumableBonuses)) {
            if (bonus === 0) continue;

            totals[stat] = (totals[stat] ?? 0) + bonus;
            sources.consumables[stat] = bonus;
        }

        return {
            ...miningStats,
            totals,
            sources,
            consumableInfo: {
                counts: miningConsumables
            }
        };
    }, [miningStats, miningConsumables]);

    const miningSections = buildMiningSections(displayedMiningStats);

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
            
            {/* Mining Context */}
            {skill.id === "mining" && (
                <MiningContextSelector
                    selectedContext={selectedMiningContext}
                    onChange={setSelectedMiningContext}
                />
            )}

            {/* Mining Overview */}
            {skill.id === "mining" && (
                <>
                    {miningLoading && (
                        <section className="dashboard-panel">
                            <p className="muted-text">
                                Loading Mining statistics...
                            </p>
                        </section>
                    )}

                    {miningError && (
                        <section className="dashboard-panel">
                            <p className="error-text">
                                {miningError}
                            </p>
                        </section>
                    )}

                    {!miningLoading && !miningError && displayedMiningStats && (
                        <MiningOverview
                            miningStats={displayedMiningStats}
                            selectedContext={selectedMiningContext}
                            playerUUID={player.uuid}
                            profileId={player.profileId}
                            onMiningConsumablesChange={handleMiningConsumablesChange}
                        />
                    )}
                </>
            )}

            {/* Statistics for other skills */}
            {skill.id !== "mining" && (
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
            )}

            {/* Full Stat Breakdown */}
            {skill.id === "mining" && !miningLoading && !miningError && displayedMiningStats && (
                <SkillStatBreakdown
                    skillName={skill.name}
                    totals={displayedMiningStats.totals}
                    displayedStats={Object.keys(displayedMiningStats.totals)}
                    sections={miningSections}
                    conditional={displayedMiningStats.conditional ?? {}}
                    consumables={miningConsumables}
                    onConsumablesChange={handleMiningConsumablesChange}
                />
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
