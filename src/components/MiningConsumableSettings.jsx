
import { useEffect, useState } from "react";
import { RotateCcw, ChevronDown, X, Pickaxe } from "lucide-react";

import "../styles/miningConsumableSettings.css";

const CONSUMABLES = [
    {
        id: "oreOats",
        name: "Ore Oats",
        stat: "Ore Fortune",
        description: "Increases Ore Fortune by 2 per use."
    },
    {
        id: "blockBran",
        name: "Block Bran",
        stat: "Block Fortune",
        description: "Increases Block Fortune by 2 per use."
    },
    {
        id: "gemstoneGrahams",
        name: "Gemstone Grahams",
        stat: "Gemstone Fortune",
        description: "Increases Gemstone Fortune by 2 per use."
    },
    {
        id: "metallicMinis",
        name: "Metallic Minis",
        stat: "Dwarven Metal Fortune",
        description: "Increases Dwarven Metal Fortune by 2 per use."
    }
];

const DEFAULT_COUNTS = {
    oreOats: 0,
    blockBran: 0,
    gemstoneGrahams: 0,
    metallicMinis: 0
};

function loadConsumables(storageKey) {
    try {
        const saved = localStorage.getItem(storageKey);

        if (!saved) {
            return { ...DEFAULT_COUNTS };
        }

        const parsed = JSON.parse(saved);

        return Object.fromEntries(
            Object.keys(DEFAULT_COUNTS).map(id => {
                const value = Number(parsed[id]);

                return [
                    id,
                    Number.isInteger(value)
                        ? Math.max(0, Math.min(5, value))
                        : 0
                ];
            })
        );
    } catch {
        return { ...DEFAULT_COUNTS };
    }
}

function ConsumableCard({
    consumable,
    count,
    onLevelChange,
    onDetails
}) {
    const [levelMenuOpen, setLevelMenuOpen] = useState(false);

    const bonus = count * 2;

    return (
        <div className="mining-item-card consumable-item-card">

            {/* Card Header */}
            <div className="mining-item-card-header">
                <div className="mining-item-icon">
                    <Pickaxe size={22} />
                </div>

                <div className="mining-item-title">
                    <strong>{consumable.name}</strong>

                    <span className="mining-item-rarity">
                        Manually tracked
                    </span>
                </div>
            </div>

            {/* Bonus */}
            <div className="consumable-card-bonus">
                <span>{consumable.stat}</span>

                <strong>
                    +{bonus.toLocaleString()}
                </strong>
            </div>

            {/* Level Selector */}
            <div className="consumable-level-control">

                <span>Uses / Level</span>

                <div className="consumable-level-dropdown">

                    <button
                        type="button"
                        className="consumable-level-button"
                        onClick={() =>
                            setLevelMenuOpen(previous => !previous)
                        }
                        aria-expanded={levelMenuOpen}
                    >
                        <span>{count} / 5</span>
                        <ChevronDown size={16} />
                    </button>

                    {levelMenuOpen && (
                        <div className="consumable-level-menu">

                            {[0, 1, 2, 3, 4, 5].map(level => (
                                <button
                                    type="button"
                                    key={level}
                                    className={
                                        count === level
                                            ? "selected"
                                            : ""
                                    }
                                    onClick={() => {
                                        onLevelChange(level);
                                        setLevelMenuOpen(false);
                                    }}
                                >
                                    Level {level}
                                    <span>
                                        +{level * 2} {consumable.stat}
                                    </span>
                                </button>
                            ))}

                        </div>
                    )}

                </div>
            </div>

            {/* Details */}
            <button
                type="button"
                className="mining-item-click-hint consumable-details-button"
                onClick={onDetails}
            >
                Click for breakdown
            </button>

        </div>
    );
}

function ConsumableDetailOverlay({
    consumable,
    count,
    onClose
}) {
    if (!consumable) return null;

    const bonus = count * 2;

    return (
        <div
            className="mining-item-overlay-backdrop"
            onClick={onClose}
        >
            <div
                className="mining-item-overlay consumable-detail-overlay"
                role="dialog"
                aria-modal="true"
                aria-label={`${consumable.name} breakdown`}
                onClick={event => event.stopPropagation()}
            >
                <div className="mining-item-overlay-header">

                    <div className="mining-item-icon large">
                        <Pickaxe size={26} />
                    </div>

                    <div className="mining-item-title">
                        <h3>{consumable.name}</h3>

                        <span className="mining-item-rarity">
                            Manually tracked
                        </span>
                    </div>

                    <button
                        type="button"
                        className="mining-item-overlay-close"
                        onClick={onClose}
                        aria-label="Close breakdown"
                    >
                        <X size={20} />
                    </button>

                </div>

                <div className="mining-item-overlay-content">

                    <h4>Stat Contribution</h4>

                    <div className="mining-overlay-stat-row">
                        <span>{consumable.stat}</span>
                        <strong>+{bonus.toLocaleString()}</strong>
                    </div>

                    <div className="mining-overlay-stat-row">
                        <span>Selected Level</span>
                        <strong>{count} / 5</strong>
                    </div>

                    <div className="mining-overlay-stat-row">
                        <span>Bonus per level</span>
                        <strong>+2</strong>
                    </div>

                    <p className="muted-text mining-overlay-note">
                        {consumable.description}
                    </p>

                    <p className="consumable-api-notice">
                        This consumable is manually tracked.
                        Its level and bonus are not provided
                        by the Hypixel API.
                    </p>

                </div>
            </div>
        </div>
    );
}

export default function MiningConsumableSettings({
    playerUUID,
    profileId,
    onChange
}) {
    const storageKey =
        `mining-consumables-${playerUUID}-${profileId}`;

    const [counts, setCounts] = useState(
        () => loadConsumables(storageKey)
    );

    const [selectedConsumable, setSelectedConsumable] =
        useState(null);

    // Notify parent when counts are initialized or changed.
    useEffect(() => {
        onChange?.(counts);
    }, [counts, onChange]);

    // Save current counts for this profile.
    useEffect(() => {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(counts)
            );
        } catch (error) {
            console.error(
                "Unable to save mining consumables:",
                error
            );
        }
    }, [counts, storageKey]);

    function updateCount(id, value) {
        const updated = {
            ...counts,
            [id]: Math.max(0, Math.min(5, Number(value)))
        };

        setCounts(updated);
    }

    function resetCounts() {
        setCounts({ ...DEFAULT_COUNTS });
    }

    return (
        <div className="consumable-settings-content">

            <div className="consumable-api-banner">
                These consumables are manually tracked and are
                not provided by the Hypixel API.
            </div>

            <div className="mining-item-card-grid consumable-card-grid">

                {CONSUMABLES.map(consumable => (
                    <ConsumableCard
                        key={consumable.id}
                        consumable={consumable}
                        count={counts[consumable.id] ?? 0}
                        onLevelChange={level =>
                            updateCount(consumable.id, level)
                        }
                        onDetails={() =>
                            setSelectedConsumable(consumable)
                        }
                    />
                ))}

            </div>

            <div className="consumable-footer">
                <span className="muted-text">
                    Saved automatically for this profile.
                </span>

                <button
                    className="consumable-reset-button"
                    onClick={resetCounts}
                    type="button"
                >
                    <RotateCcw size={15} />
                    Reset
                </button>
            </div>

            <ConsumableDetailOverlay
                consumable={selectedConsumable}
                count={
                    selectedConsumable
                        ? counts[selectedConsumable.id] ?? 0
                        : 0
                }
                onClose={() => setSelectedConsumable(null)}
            />

        </div>
    );
}
