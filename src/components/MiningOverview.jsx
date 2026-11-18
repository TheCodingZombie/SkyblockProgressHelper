
import { Pickaxe, TrendingUp, Coins } from "lucide-react";

import { MINING_CONTEXTS } from "../config/miningContexts";

import SkillItemCard, {
    getRelevantStats
} from "./SkillItemCard";

import { formatStat } from "../utils/formatStat";

import { getPetTextureUrl } from "../utils/petTextures";

import "../styles/miningOverview.css";

function formatPetName(type) {
    if (!type) return "Unknown Pet";

    return String(type)
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function ItemCategory({
    title,
    items,
    displayedStats,
    totals
}) {
    if (!items?.length) return null;

    const relevantItems = items.filter(item =>
        getRelevantStats(item.stats, displayedStats).length > 0
    );

    if (!relevantItems.length) return null;

    return (
        <details className="mining-source-group" open>
            <summary>
                <span>{title}</span>

                <span className="source-stat-count">
                    {relevantItems.length} items
                </span>
            </summary>

            <div className="mining-item-card-grid">
                {relevantItems.map((item, index) => (
                    <SkillItemCard
                        key={item.id || `${title}-${index}`}
                        item={item}
                        displayedStats={displayedStats}
                        totals={totals}
                    />
                ))}
            </div>
        </details>
    );
}

function AggregateSource({
    title,
    stats,
    displayedStats
}) {
    const relevantStats = getRelevantStats(
        stats,
        displayedStats
    );

    if (!relevantStats.length) return null;

    return (
        <details className="mining-source-group">
            <summary>
                <span>{title}</span>

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
                        <strong>+{formatStat(stat.value)}</strong>
                    </div>
                ))}
            </div>
        </details>
    );
}

export default function MiningOverview({
    miningStats,
    selectedContext,
    playerUUID,
    profileId,
    onMiningConsumablesChange
}) {
    const context = MINING_CONTEXTS.find(
        entry => entry.id === selectedContext
    );

    if (!miningStats || !context) return null;

    const displayedStats = context.stats;
    const itemBreakdown = miningStats.itemBreakdown ?? {};

    const accessories =
        miningStats.accessoryInfo?.items ?? [];

    // Build the pet card using the real active pet type/name.
    const petInfo = miningStats.petInfo ?? {};

    const petCard = petInfo.type
        ? {
            id: petInfo.type,
            petType: petInfo.type,
            isPet: true,
            textureUrl: getPetTextureUrl(petInfo.type),
            name: petInfo.name || formatPetName(petInfo.type),
            rarity: petInfo.rarity,
            stats: miningStats.sources?.pet ?? {}
        }
        : null;


    console.log("PET CARD:", petCard);
    console.log(
        "PET TEXTURE URL:",
        getPetTextureUrl(petInfo.type)
    );

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

                <div className="mining-contributions">

                    <h3>Stat Contributions</h3>

                    {/* Pet with actual name */}
                    {petCard && (
                        <ItemCategory
                            title="Pet"
                            items={[petCard]}
                            displayedStats={displayedStats}
                            totals={miningStats.totals}
                        />
                    )}

                    {/* Armor */}
                    <ItemCategory
                        title="Armor"
                        items={itemBreakdown.armor}
                        displayedStats={displayedStats}
                        totals={miningStats.totals}
                    />

                    {/* Equipment */}
                    <ItemCategory
                        title="Equipment"
                        items={itemBreakdown.equipment}
                        displayedStats={displayedStats}
                        totals={miningStats.totals}
                    />
                </div>
            </section>

            {/* Mining Rates */}
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
