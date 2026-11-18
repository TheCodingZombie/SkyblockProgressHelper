function cleanMinecraftText(text) {
    return String(text ?? "")
        .replace(/§[0-9a-fk-or]/gi, "")
        .trim();
}

function parseLoreStats(lore) {
    return (lore ?? [])
        .map(rawLine => {
            const line = cleanMinecraftText(rawLine);

            const match = line.match(
                /^(.+?):\s*([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/
            );

            if (!match) return null;

            return {
                name: match[1].trim(),
                value: Number(match[2].replace(/,/g, "")),
                details: match[3].trim(),
                raw: line
            };
        })
        .filter(Boolean);
}

function parseAccessoryRarity(lore) {
    const text = (lore ?? [])
        .map(cleanMinecraftText)
        .join(" ")
        .toUpperCase();

    const rarities = [
        "VERY SPECIAL",
        "SPECIAL",
        "MYTHIC",
        "LEGENDARY",
        "EPIC",
        "RARE",
        "UNCOMMON",
        "COMMON"
    ];

    return rarities.find(rarity =>
        text.includes(rarity)
    ) ?? null;
}

function parseItem(item) {
    const tag = item.tag ?? {};
    const extra = tag.ExtraAttributes ?? {};
    const display = tag.display ?? {};

    const lore = display.Lore ?? [];
    const stats = parseLoreStats(lore);

    const accessoryPowerStat = stats.find(
        stat => stat.name === "Accessory Power"
    );

    return {
        id: extra.id ?? null,
        name: cleanMinecraftText(display.Name),
        
        rarity: parseAccessoryRarity(lore),
        
        rarityUpgrades: extra.rarity_upgrades ?? 0,
        modifier: extra.modifier ?? null,
        enrichment: extra.talisman_enrichment ?? null,

        accessoryPower: accessoryPowerStat?.value ?? 0,

        stats: stats.filter(
            stat => stat.name !== "Accessory Power"
        ),

        lore,
        extraAttributes: extra
    };
}

module.exports = {
    cleanMinecraftText,
    parseLoreStats,
    parseItem
};