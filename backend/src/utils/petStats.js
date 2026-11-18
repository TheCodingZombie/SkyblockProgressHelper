// Total XP required for a Legendary pet to reach level 100. TODO add the total XP for each rarity
const LEGENDARY_PET_LEVEL_100_XP = 25353230;

function calculatePetStats(pet, targetStats = []) {
    const stats = Object.fromEntries(
        targetStats.map(stat => [stat, 0])
    );

    const conditional = {};

    if (!pet || !pet.active) {
        return {
            stats,
            conditional,
            level: null,
            petType: null
        };
    }

    if (pet.type !== "SCATHA" || pet.tier !== "LEGENDARY") {
        throw new Error(
            `Pet calculation not implemented for ${pet.tier} ${pet.type}.`
        );
    }

    // This initial implementation handles max-level Scathas.
    if (pet.exp < LEGENDARY_PET_LEVEL_100_XP) {
        throw new Error(
            "Underleveled Scatha XP calculation has not been implemented yet."
        );
    }

    const level = 100;

    if (Object.hasOwn(stats, "Mining Speed")) {
        stats["Mining Speed"] += level;
    }

    if (Object.hasOwn(stats, "Mining Fortune")) {
        stats["Mining Fortune"] += level * 1.25;
    }

    if (pet.heldItem === "BEJEWELED_COLLAR") {
        if (Object.hasOwn(stats, "Mining Speed")) {
            stats["Mining Speed"] += 25;
        }

        if (Object.hasOwn(stats, "Mining Fortune")) {
            stats["Mining Fortune"] += 10;
        }
    }

    // Drill Infusion only applies when using a Drill.
    if (Object.hasOwn(stats, "Gemstone Fortune")) {
        conditional.drill = {
            "Gemstone Fortune": level * 1.25
        };
    }

    return {
        stats,
        conditional,
        level,
        petType: pet.type,
        rarity: pet.tier,
        heldItem: pet.heldItem,
        perks: {
            burrowing: level * 0.5,
            drillInfusion: level * 1.25,
            bejeweledEyes: level * 0.2
        }
    };
}

module.exports = { calculatePetStats };
