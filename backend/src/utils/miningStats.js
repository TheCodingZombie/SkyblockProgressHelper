
const { calculateAccessoryStats } = require("./accessoryStats");
const { calculateGearStats } = require("./gearStats");
const { calculatePetStats } = require("./petStats");
const { calculateHotmStats } = require("./hotmStats");
const { calculateConsumableStats } = require("./consumableStats");

const MINING_STATS = [
    "Mining Speed",
    "Mining Fortune",
    "Ore Fortune",
    "Block Fortune",
    "Gemstone Fortune",
    "Dwarven Metal Fortune",
    "Pristine"
];

function createEmptyStats() {
    return Object.fromEntries(
        MINING_STATS.map(stat => [stat, 0])
    );
}


function calculateMiningStats({
    accessories = [],
    armor = [],
    equipment = [],
    pet = null,
    skillTree = {},
    consumables = {}
} = {}) {
    const totals = createEmptyStats();

    const accessoryStats = calculateAccessoryStats(accessories, MINING_STATS);
    const gearStats = calculateGearStats(armor, equipment, MINING_STATS);

    const petStats = calculatePetStats(pet, MINING_STATS);

    const hotmStats = calculateHotmStats(skillTree);
    
    const consumableStats = calculateConsumableStats(consumables);
    
    const sources = {
        accessories: accessoryStats,
        armor: gearStats.armor,
        equipment: gearStats.equipment,
        pet: petStats.stats,
        hotm: hotmStats.stats,
        consumables: consumableStats.stats
    };

    // Combine every source into the final totals.
    for (const source of Object.values(sources)) {
        for (const stat of MINING_STATS) {
            totals[stat] += source[stat] ?? 0;
        }
    }

    return {
        totals,
        sources,
        conditional: {
            pet: petStats.conditional,
            hotm: hotmStats.conditional
        },
        petInfo: {
            level: petStats.level,
            type: petStats.petType,
            rarity: petStats.rarity,
            heldItem: petStats.heldItem,
            perks: petStats.perks
        },
        hotmInfo: {
            coreLevel: hotmStats.coreLevel,
            abilityLevel: hotmStats.abilityLevel,
            abilities: hotmStats.abilityDetails
        },
        consumableInfo: {
            counts: consumableStats.counts
        }
    };
}

module.exports = { calculateMiningStats };
