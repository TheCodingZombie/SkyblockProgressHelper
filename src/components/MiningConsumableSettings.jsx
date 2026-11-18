
import { useEffect, useState } from "react";
import { Pickaxe, RotateCcw } from "lucide-react";

import "../styles/miningConsumableSettings.css";

const CONSUMABLES = [
    {
        id: "oreOats",
        name: "Ore Oats",
        stat: "Ore Fortune"
    },
    {
        id: "blockBran",
        name: "Block Bran",
        stat: "Block Fortune"
    },
    {
        id: "gemstoneGrahams",
        name: "Gemstone Grahams",
        stat: "Gemstone Fortune"
    },
    {
        id: "metallicMinis",
        name: "Metallic Minis",
        stat: "Dwarven Metal Fortune"
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

    // Save changes and notify the parent component.
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

        onChange?.(counts);
    }, [counts, storageKey, onChange]);

    function updateCount(id, value) {
        const parsed = Number(value);

        const nextValue = Number.isInteger(parsed)
            ? Math.max(0, Math.min(5, parsed))
            : 0;

        setCounts(previous => ({
            ...previous,
            [id]: nextValue
        }));
    }

    function resetCounts() {
        setCounts({ ...DEFAULT_COUNTS });
    }

    return (
        <section className="dashboard-panel mining-consumables-panel">

            <div className="section-heading">
                <div>
                    <h2>Permanent Mining Upgrades</h2>
                    <p className="muted-text">
                        Track your Dwarven O's consumables.
                    </p>
                </div>

                <Pickaxe size={22} />
            </div>

            <div className="consumable-list">

                {CONSUMABLES.map(consumable => (
                    <div
                        className="consumable-row"
                        key={consumable.id}
                    >
                        <div className="consumable-info">
                            <strong>{consumable.name}</strong>

                            <span>
                                +2 {consumable.stat} per use
                            </span>
                        </div>

                        <div className="consumable-input-group">
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="1"
                                value={counts[consumable.id]}
                                onChange={event =>
                                    updateCount(
                                        consumable.id,
                                        event.target.value
                                    )
                                }
                                aria-label={`${consumable.name} uses`}
                            />

                            <span>/ 5</span>
                        </div>

                        <strong className="consumable-bonus">
                            +{counts[consumable.id] * 2}
                        </strong>
                    </div>
                ))}

            </div>

            <div className="consumable-footer">
                <span className="muted-text">
                    Values are manually tracked and saved automatically.
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

        </section>
    );
}
