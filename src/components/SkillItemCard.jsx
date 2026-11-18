
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Package, Info, X } from "lucide-react";

import { getItemTextureUrl } from "../utils/itemTextures";
import { getPetTextureUrl } from "../utils/petTextures";
import { formatStat } from "../utils/formatStat";

import "../styles/miningItemCard.css";

export function normalizeStats(stats) {
    if (Array.isArray(stats)) {
        return stats.map(stat => ({
            name: stat.name,
            value: Number(stat.value ?? 0),
            details: stat.details
        }));
    }

    return Object.entries(stats ?? {}).map(([name, value]) => ({
        name,
        value: Number(value ?? 0)
    }));
}

export function getRelevantStats(stats, displayedStats = []) {
    const normalized = normalizeStats(stats);

    // If no stat filter is provided, show every nonzero stat.
    if (displayedStats.length === 0) {
        return normalized.filter(stat => stat.value !== 0);
    }

    return normalized.filter(stat =>
        displayedStats.includes(stat.name) &&
        stat.value !== 0
    );
}

export default function SkillItemCard({
    item,
    stats: providedStats,
    displayedStats = [],
    totals = {},
    category,
    progress = {},
    breakdown = [],
    detailNote,
    icon,
    onClick
}) {
    const [showDetails, setShowDetails] = useState(false);
    
    const [textureFailed, setTextureFailed] = useState(false);

    useEffect(() => {
        setTextureFailed(false);
    }, [item.id]);

    const rawStats = providedStats ?? item.stats;

    const visibleStats = getRelevantStats(
        rawStats,
        displayedStats
    );

    if (visibleStats.length === 0) {
        return null;
    }

    const itemTexture =
        item.textureUrl ??
        item.texture ??
        item.image ??
        (item.isPet
            ? getPetTextureUrl(item.petType ?? item.id)
            : getItemTextureUrl(item.id)) ??
        item.icon ??
        icon;

    console.log("CARD ITEM:", item);
    console.log("RESOLVED TEXTURE:", itemTexture);

    function getProgress(statName, statValue) {
        // Custom progress values take precedence.
        if (typeof progress[statName] === "number") {
            return Math.max(
                0,
                Math.min(100, progress[statName])
            );
        }

        // Otherwise, calculate progress relative to the total.
        const total = Number(totals?.[statName] ?? 0);

        if (total <= 0) return 0;

        return Math.max(
            0,
            Math.min(100, (statValue / total) * 100)
        );
    }

    function handleCardClick() {
        setShowDetails(true);
        onClick?.(item);
    }

    function renderItemTexture() {
        if (
            typeof itemTexture === "string" &&
            itemTexture &&
            !textureFailed
        ) {
            return (
                <img
                    src={itemTexture}
                    alt=""
                    className="mining-item-texture"
                    onLoad={(event) => {
                        console.log("TEXTURE LOADED:", event.target.src);
                        setTextureFailed(false);
                    }}
                    onError={(event) => {
                        console.error("TEXTURE FAILED:", event.target.src);
                        setTextureFailed(true);
                    }}
                />
            );
        }

        if (itemTexture && typeof itemTexture !== "string") {
            return itemTexture;
        }

        return <Package size={22} />;
    }

    return (
        <>
            {/* Item Card */}
            <button
                type="button"
                className="mining-item-card"
                onClick={handleCardClick}
            >
                <div className="mining-item-card-header">

                    <div className="mining-item-texture">
                        {renderItemTexture()}
                    </div>

                    <div className="mining-item-title">
                        <strong>{item.name || item.id}</strong>

                        {(category || item.rarity) && (
                            <span className="mining-item-category">
                                {category ?? item.rarity}
                            </span>
                        )}
                    </div>

                    <Info
                        className="mining-item-info-icon"
                        size={16}
                    />

                </div>

                <div className="mining-item-card-stats">
                    {visibleStats.map(stat => (
                        <div
                            className="mining-card-stat"
                            key={stat.name}
                        >
                            <div className="mining-card-stat-heading">
                                <span>{stat.name}</span>

                                <strong>
                                    +{formatStat(stat.value)}
                                </strong>
                            </div>

                            <div className="mining-card-stat-bar">
                                <div
                                    className="mining-card-stat-bar-fill"
                                    style={{
                                        width: `${getProgress(
                                            stat.name,
                                            stat.value
                                        )}%`
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <span className="mining-item-card-click-hint">
                    Click for details
                </span>
            </button>

            {/* Details Overlay */}
            {showDetails && createPortal(
                <div
                    className="skill-item-popup-backdrop"
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="mining-item-popup"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${item.name || item.id} stat breakdown`}
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="mining-item-popup-header">
                            <div className="mining-item-popup-title">
                                <div className="mining-item-texture">
                                    {renderItemTexture()}
                                </div>

                                <div>
                                    <h3>{item.name || item.id}</h3>
                                    <span>{category ?? item.rarity ?? "Item"}</span>
                                </div>
                            </div>

                            <button
                                className="mining-item-popup-close"
                                type="button"
                                aria-label="Close details"
                                onClick={() => setShowDetails(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mining-item-popup-content">
                            <h4>Stat Breakdown</h4>

                            {visibleStats.map(stat => (
                                <div
                                    className="mining-item-popup-stat"
                                    key={stat.name}
                                >
                                    <span>{stat.name}</span>
                                    <strong>+{formatStat(stat.value)}</strong>
                                </div>
                            ))}

                            {breakdown.length > 0 && (
                                <>
                                    <div className="mining-item-popup-divider" />

                                    <h4>Sources</h4>

                                    {breakdown.map((source, index) => (
                                        <div
                                            className="mining-item-popup-source"
                                            key={source.id ?? index}
                                        >
                                            <strong>{source.name}</strong>

                                            {source.stats && (
                                                <div>
                                                    {normalizeStats(source.stats).map(stat => (
                                                        <div
                                                            className="mining-item-popup-stat"
                                                            key={stat.name}
                                                        >
                                                            <span>{stat.name}</span>
                                                            <strong>
                                                                +{formatStat(stat.value)}
                                                            </strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            {breakdown.length === 0 && (
                                <p className="mining-item-popup-note">
                                    {detailNote ??
                                        "Detailed source breakdown will be available as we integrate base stats, reforges, gemstones, upgrades, and other modifiers."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
