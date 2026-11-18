const MINING_STATS = [
    "Ore Fortune",
    "Block Fortune",
    "Gemstone Fortune",
    "Dwarven Metal Fortune"
];

const CONSUMABLES = {
    oreOats: {
        stat: "Ore Fortune",
        amountPerUse: 2
    },
    blockBran: {
        stat: "Block Fortune",
        amountPerUse: 2
    },
    gemstoneGrahams: {
        stat: "Gemstone Fortune",
        amountPerUse: 2
    },
    metallicMinis: {
        stat: "Dwarven Metal Fortune",
        amountPerUse: 2
    }
};

function calculateConsumableStats(consumables = {}) {
    const stats = Object.fromEntries(
        MINING_STATS.map(stat => [stat, 0])
    );

    const counts = {};

    for (const [id, definition] of Object.entries(CONSUMABLES)) {
        const count = consumables[id] ?? 0;

        if (!Number.isInteger(count) || count < 0 || count > 5) {
            throw new Error(
                `${id} must be a whole number between 0 and 5.`
            );
        }

        counts[id] = count;
        stats[definition.stat] += count * definition.amountPerUse;
    }

    return { stats, counts };
}

module.exports = { calculateConsumableStats };