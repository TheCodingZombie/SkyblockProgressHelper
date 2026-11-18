
import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import SkillItemCard from "./SkillItemCard";

import { getPetTextureUrl } from "../utils/petTextures";
import { formatStat } from "../utils/formatStat";

import "../styles/skillStatBreakdown.css";

import blockBranTexture from "../assets/consumables/block-bran.png";
import oreOatsTexture from "../assets/consumables/ore-oats.png";
import gemstoneGrahamsTexture from "../assets/consumables/gemstone-grahams.png";
import metallicMinisTexture from "../assets/consumables/metallic-minis.png";

const MINING_CONSUMABLES = [
    {
        id: "oreOats",
        name: "Dwarven O's Ore Oats",
        stat: "Ore Fortune",
        textureUrl: oreOatsTexture
    },
    {
        id: "blockBran",
        name: "Dwarven O's Block Bran",
        stat: "Block Fortune",
        textureUrl: blockBranTexture
    },
    {
        id: "gemstoneGrahams",
        name: "Dwarven O's Gemstone Grahams",
        stat: "Gemstone Fortune",
        textureUrl: gemstoneGrahamsTexture
    },
    {
        id: "metallicMinis",
        name: "Dwarven O's Metallic Minis",
        stat: "Dwarven Metal Fortune",
        textureUrl: metallicMinisTexture
    }
];

function ConsumableCard({
    consumable,
    level,
    onLevelChange
}) {
    const bonus = level * 2;
    const progress = (level / 5) * 100;

    return (
        <div className="skill-consumable-card">
            {/* Item header */}
            <div className="skill-consumable-card-header">
                <div className="skill-consumable-card-icon">
                    {consumable.textureUrl ? (
                        <img
                            src={consumable.textureUrl}
                            alt={consumable.name}
                        />
                    ) : (
                        <span>🍪</span>
                    )}
                </div>

                <div className="skill-consumable-card-title">
                    <strong>{consumable.name}</strong>
                    <span>{consumable.stat}</span>
                </div>

                <div className="skill-consumable-bonus-badge">
                    +{bonus}
                </div>
            </div>

            {/* Current level */}
            <div className="skill-consumable-level">
                <span>Upgrade Level</span>
                <strong>{level} / 5</strong>
            </div>

            {/* Level slider */}
            <div className="skill-consumable-slider-container">
                <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={level}
                    aria-label={`${consumable.name} level`}
                    onChange={(event) =>
                        onLevelChange(
                            consumable.id,
                            Number(event.target.value)
                        )
                    }
                    style={{
                        "--slider-progress": `${progress}%`
                    }}
                />

                <div className="skill-consumable-slider-labels">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                </div>
            </div>

            {/* Precise level selection */}
            <div className="skill-consumable-level-selector">
                <label htmlFor={`consumable-${consumable.id}`}>
                    Select Level
                </label>

                <select
                    id={`consumable-${consumable.id}`}
                    value={level}
                    onChange={(event) =>
                        onLevelChange(
                            consumable.id,
                            Number(event.target.value)
                        )
                    }
                >
                    {[0, 1, 2, 3, 4, 5].map(value => (
                        <option key={value} value={value}>
                            Level {value}
                        </option>
                    ))}
                </select>
            </div>

            {/* Stat contribution */}
            <div className="skill-consumable-bonus">
                <span>Stat Contribution</span>
                <strong>
                    +{formatStat(bonus)} {consumable.stat}
                </strong>
            </div>
        </div>
    );
}


export default function SkillStatBreakdown({
    skillName,
    totals = {},
    displayedStats = [],
    sections = [],
    conditional = {},
    onItemClick,
    consumables = {},
    onConsumablesChange
}) {
    const [expandedSections, setExpandedSections] = useState({});

    function toggleSection(sectionId) {
        setExpandedSections((previous) => ({
            ...previous,
            [sectionId]: !previous[sectionId]
        }));
    }

    function handleConsumableLevelChange(id, level) {
        onConsumablesChange?.({
            ...consumables,
            [id]: level
        });
    }

    const consumableSectionExpanded =
        expandedSections.consumables ?? true;

    return (
        <section className="skill-stat-breakdown">
            {/* Total Stats */}
            <div className="skill-breakdown-total-panel">
                <div className="skill-breakdown-heading">
                    <BarChart3 size={20} />
                    <h2>{skillName} Stat Breakdown</h2>
                </div>

                <div className="skill-breakdown-total-grid">
                    {displayedStats.map((stat) => (
                        <div
                            className="skill-breakdown-total-stat"
                            key={stat}
                        >
                            <span>{stat}</span>
                            <strong>
                                {formatStat(totals[stat])}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stat Source Categories */}
            <div className="skill-breakdown-sections">
                {sections.map((section) => {
                    const isExpanded =
                        expandedSections[section.id] ?? true;

                    const items = section.items ?? [];
                    const aggregateStats = section.aggregateStats ?? {};
                    
                    const petInfo = section.petInfo ?? null;

                    const hasPetInfo = Boolean(petInfo?.type);

                    const petCard = hasPetInfo
                        ? {
                            id: petInfo.type,
                            petType: petInfo.type,
                            isPet: true,
                            textureUrl: getPetTextureUrl(petInfo.type),
                            name:
                                petInfo.name ||
                                petInfo.type
                                    .split("_")
                                    .map((word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase()
                                    )
                                    .join(" "),
                            rarity: petInfo.rarity,
                            stats: aggregateStats
                        }
                        : null;

                    const hasItems = items.length > 0;
                    const hasAggregateStats =
                        Object.values(aggregateStats).some(
                            (value) => Number(value) !== 0
                        );

                    if (!hasItems && !hasAggregateStats && !hasPetInfo) {
                        return null;
                    }

                    return (
                        <div
                            className="skill-breakdown-section"
                            key={section.id}
                        >
                            <button
                                type="button"
                                className="skill-breakdown-section-header"
                                onClick={() => toggleSection(section.id)}
                            >
                                <div>
                                    <h3>{section.title}</h3>
                                    {section.description && (
                                        <p>{section.description}</p>
                                    )}
                                </div>

                                {isExpanded ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="skill-breakdown-section-content">
                                    {/* Itemized sources */}
                                    {hasItems && (
                                        <div className="skill-breakdown-item-grid">
                                            {items.map((item, index) => (
                                                <SkillItemCard
                                                    key={item.id ?? item.name ?? index}
                                                    item={item}
                                                    displayedStats={
                                                        section.displayedStats ??
                                                        displayedStats
                                                    }
                                                    totals={totals}
                                                    onClick={onItemClick}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Aggregate sources */}
                                    {hasAggregateStats && (
                                        <div className="skill-breakdown-aggregate">
                                            {hasPetInfo ? (
                                                <div className="skill-breakdown-item-grid">
                                                    <SkillItemCard
                                                        item={petCard}
                                                        displayedStats={
                                                            section.displayedStats ??
                                                            displayedStats
                                                        }
                                                        totals={totals}
                                                        onClick={onItemClick}
                                                    />
                                                </div>
                                            ) : (
                                                Object.entries(aggregateStats)
                                                    .filter(
                                                        ([, value]) => Number(value) !== 0
                                                    )
                                                    .map(([stat, value]) => (
                                                        <div
                                                            className="skill-breakdown-aggregate-stat"
                                                            key={stat}
                                                        >
                                                            <span>{stat}</span>
                                                            <strong>
                                                                +{formatStat(value)}
                                                            </strong>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mining Consumables */}
            {skillName === "Mining" && (
                <div className="skill-breakdown-section skill-consumables-section">
                    <button
                        type="button"
                        className="skill-breakdown-section-header"
                        onClick={() => toggleSection("consumables")}
                    >
                        <div>
                            <h3>Mining Consumables</h3>
                            <p>
                                Adjust consumable levels to update your stats.
                            </p>
                        </div>

                        {consumableSectionExpanded ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </button>

                    {consumableSectionExpanded && (
                        <div className="skill-breakdown-section-content">
                            <div className="skill-consumable-grid">
                                {MINING_CONSUMABLES.map((consumable) => {
                                    const level = Number(
                                        consumables[consumable.id] ?? 0
                                    );

                                    return (
                                        <ConsumableCard
                                            key={consumable.id}
                                            consumable={consumable}
                                            level={level}
                                            total={totals[consumable.stat]}
                                            onLevelChange={
                                                handleConsumableLevelChange
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Conditional Bonuses */}
            {Object.keys(conditional).length > 0 && (
                <div className="skill-breakdown-conditional">
                    <h3>Conditional Bonuses</h3>

                    {Object.entries(conditional).map(
                        ([conditionName, stats]) => {
                            const entries = Object.entries(stats ?? {})
                                .filter(
                                    ([, value]) => Number(value) !== 0
                                );

                            if (entries.length === 0) {
                                return null;
                            }

                            return (
                                <div
                                    className="skill-breakdown-condition"
                                    key={conditionName}
                                >
                                    <h4>{conditionName}</h4>

                                    {entries.map(([stat, value]) => (
                                        <div
                                            className="skill-breakdown-conditional-stat"
                                            key={stat}
                                        >
                                            <span>{stat}</span>
                                            <strong>
                                                +{formatStat(value)}
                                            </strong>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                    )}
                </div>
            )}
        </section>
    );
}
