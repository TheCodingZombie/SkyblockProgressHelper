
const { parseItem } = require("./itemParser");

// Recursively find actual Minecraft item objects inside decoded NBT.
function findInventoryItems(value, items = []) {
    if (!value) return items;

    if (Array.isArray(value)) {
        for (const entry of value) {
            findInventoryItems(entry, items);
        }

        return items;
    }

    if (typeof value !== "object") {
        return items;
    }

    // An actual item has ExtraAttributes inside its NBT tag.
    if (value.tag?.ExtraAttributes) {
        items.push(value);
        return items;
    }

    for (const nestedValue of Object.values(value)) {
        findInventoryItems(nestedValue, items);
    }

    return items;
}

function parseAccessoryBag(decodedInventory) {
    const rawItems = findInventoryItems(
        decodedInventory?.data ?? decodedInventory
    );

    return rawItems
        .map(item => parseItem(item))
        .filter(item => item.id);
}

function calculateAccessoryStats(accessories = [], targetStats = []) {
    const totals = Object.fromEntries(
        targetStats.map(stat => [stat, 0])
    );

    for (const accessory of accessories) {
        for (const stat of accessory.stats ?? []) {
            if (Object.hasOwn(totals, stat.name)) {
                totals[stat.name] += Number(stat.value) || 0;
            }
        }
    }

    return totals;
}

module.exports = { 
    findInventoryItems,
    parseAccessoryBag,
    calculateAccessoryStats 
};