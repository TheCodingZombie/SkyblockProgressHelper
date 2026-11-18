
const HOTM_STATS = [
    "Mining Speed",
    "Mining Fortune",
    "Ore Fortune",
    "Block Fortune",
    "Gemstone Fortune",
    "Dwarven Metal Fortune",
    "Pristine"
];

function calculateHotmStats(skillTree = {}) {
    const nodes = skillTree.nodes?.mining ?? {};
    const selectedAbilities = skillTree.selected_ability ?? {};

    const stats = Object.fromEntries(
        HOTM_STATS.map(stat => [stat, 0])
    );

    const conditional = {};

    // A node is enabled unless its profile explicitly says otherwise.
    function getLevel(nodeId) {
        const enabled = nodes[`toggle_${nodeId}`] !== false;

        if (!enabled) return 0;

        return Number(nodes[nodeId]) || 0;
    }

    // Permanent, unconditional bonuses.
    stats["Mining Speed"] += getLevel("mining_speed") * 20;
    stats["Mining Speed"] += getLevel("speedy_mineman") * 40;

    stats["Mining Fortune"] += getLevel("mining_fortune") * 2;
    stats["Mining Fortune"] += getLevel("fortunate_mineman") * 3;

    stats["Ore Fortune"] += getLevel("old_school") * 5;
    stats["Block Fortune"] += getLevel("blockhead") * 5;

    stats["Gemstone Fortune"] += getLevel("gem_lover") * 4;

    // Gem Lover starts at 24 at level 1, rather than 4.
    if (getLevel("gem_lover") > 0) {
        stats["Gemstone Fortune"] += 20;
    }

    stats["Dwarven Metal Fortune"] +=
        getLevel("metal_head") * 5;

    stats["Pristine"] += getLevel("mining_master") * 0.1;

    // Conditional bonuses.
    const professionalLevel = getLevel("professional");

    if (professionalLevel > 0) {
        conditional.gemstones = {
            "Mining Speed": 50 + professionalLevel * 5
        };
    }

    const strongArmLevel = getLevel("strong_arm");

    if (strongArmLevel > 0) {
        conditional.dwarvenMetals = {
            "Mining Speed": strongArmLevel * 5
        };
    }

    const eagerAdventurerLevel = getLevel("eager_adventurer");

    if (eagerAdventurerLevel > 0) {
        conditional.mineshafts = {
            ...(conditional.mineshafts ?? {}),
            "Mining Speed": eagerAdventurerLevel * 4
        };
    }

    const ragsToRichesLevel = getLevel("rags_to_riches");

    if (ragsToRichesLevel > 0) {
        conditional.mineshafts = {
            ...(conditional.mineshafts ?? {}),
            "Mining Fortune": ragsToRichesLevel * 4
        };
    }

    // Core of the Mountain upgrades Pickaxe Ability levels.
    const coreLevel = getLevel("core_of_the_mountain");

    const abilityLevel = coreLevel >= 2 ? 2 : 1;

    const abilityDetails = {
        maniac_miner: {
            selected: selectedAbilities.mining === "maniac_miner",
            bonusPerBlock: 5 * abilityLevel,
            durationSeconds: 20 + 5 * abilityLevel,
            maxMiningFortune: 500
        },
        pickobulus: {
            selected: selectedAbilities.mining_2 === "pickobulus",
            cooldownSeconds: 70 - 10 * abilityLevel
        }
    };

    return {
        stats,
        conditional,
        abilityDetails,
        coreLevel,
        abilityLevel
    };
}

module.exports = { calculateHotmStats };
