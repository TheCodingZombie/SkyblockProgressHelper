// Remove Minecraft formatting codes before reading lore.
function cleanLoreLine(line) {
    return String(line ?? "")
        .replace(/§[0-9a-fk-or]/gi, "")
        .trim();
}

function extractItemStats(item, targetStats = []) {
    const stats = {};

    for (const line of item.lore ?? []) {
        const cleanedLine = cleanLoreLine(line);

        for (const stat of targetStats) {
            // Only read lines formatted as "Stat Name: +123".
            // This deliberately ignores conditional bonus descriptions.
            const pattern = new RegExp(
                `^${stat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*([+-]?\\d+(?:\\.\\d+)?)`
            );

            const match = cleanedLine.match(pattern);

            if (match) {
                stats[stat] = Number(match[1]);
            }
        }
    }

    return stats;
}

function calculateGearStats(armor = [], equipment = [], targetStats = []) {
    function calculateGroup(items) {
        const totals = Object.fromEntries(
            targetStats.map(stat => [stat, 0])
        );

        for (const item of items) {
            const itemStats = extractItemStats(item, targetStats);

            for (const stat of targetStats) {
                totals[stat] += itemStats[stat] ?? 0;
            }
        }

        return totals;
    }

    return {
        armor: calculateGroup(armor),
        equipment: calculateGroup(equipment)
    };
}

module.exports = {
    calculateGearStats,
    extractItemStats
};
