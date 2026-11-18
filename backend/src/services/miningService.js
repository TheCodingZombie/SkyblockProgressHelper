
const { getProfile } = require("./hypixelService");

const { decodeInventoryContents } = require("../utils/inventoryDecoder");
const { parseItem } = require("../utils/itemParser");
const { findInventoryItems, parseAccessoryBag } = require("../utils/accessoryStats");
const { calculateMiningStats } = require("../utils/miningStats");

const { extractItemStats } = require("../utils/gearStats");

const MINING_ITEM_STATS = [
    "Mining Speed",
    "Mining Fortune",
    "Ore Fortune",
    "Block Fortune",
    "Gemstone Fortune",
    "Dwarven Metal Fortune",
    "Pristine"
];

function createItemBreakdown(items) {
    return items.map(item => {
        const stats = extractItemStats(
            item,
            MINING_ITEM_STATS
        );

        // Preserve parsed lore entries for future source breakdowns.
        const rawStats = (item.stats ?? [])
            .filter(stat =>
                MINING_ITEM_STATS.includes(stat.name)
            )
            .map(stat => ({
                name: stat.name,
                value: stat.value,
                details: stat.details,
                raw: stat.raw
            }));

        return {
            id: item.id,
            name: item.name,
            rarity: item.rarity,
            modifier: item.modifier,
            rarityUpgrades: item.rarityUpgrades ?? 0,

            // Total contribution from this individual item.
            stats,

            // Parsed stat lore for future popup breakdowns.
            rawStats,

            // Selected metadata useful for future enhancement parsing.
            extraAttributes: item.extraAttributes ?? {}
        };
    });
}

async function getMiningStats({ uuid, profileId, consumables = {} }) {
    if (!uuid || !profileId) {
        throw new Error("Player UUID and profile ID are required.");
    }

    // Fetch the selected SkyBlock profile.
    const result = await getProfile(profileId);
    const profile = result.data.profile;

    if (!profile?.members) {
        throw new Error("SkyBlock profile data was not found.");
    }

    // Find the requested player within the profile.
    const normalizedUUID = uuid.replaceAll("-", "").toLowerCase();

    const memberEntry = Object.entries(profile.members).find(
        ([memberUUID]) =>
            memberUUID.replaceAll("-", "").toLowerCase() === normalizedUUID
    );

    if (!memberEntry) {
        throw new Error("Player was not found in this SkyBlock profile.");
    }

    const member = memberEntry[1];

    // Decode the three relevant inventories.
    const [
        decodedArmor,
        decodedEquipment,
        decodedAccessories
    ] = await Promise.all([
        decodeInventoryContents(member.inventory?.inv_armor?.data),
        decodeInventoryContents(member.inventory?.equipment_contents?.data),
        decodeInventoryContents(
            member.inventory?.bag_contents?.talisman_bag?.data
        )
    ]);

    // Convert armor and equipment into parsed item objects.
    const armor = findInventoryItems(decodedArmor?.data)
        .map(item => parseItem(item))
        .filter(item => item.id);

    const equipment = findInventoryItems(decodedEquipment?.data)
        .map(item => parseItem(item))
        .filter(item => item.id);

    // Parse accessories from the accessory bag.
    const accessories = parseAccessoryBag(decodedAccessories);

    // Find the player's active pet.
    const activePets = (member.pets_data?.pets ?? [])
        .filter(pet => pet.active);

    // Calculate all supported Mining stats.
    const miningStats = calculateMiningStats({
        accessories,
        armor,
        equipment,
        pet: activePets[0] ?? null,
        skillTree: member.skill_tree ?? {},
        consumables
    });

    return {
        ...miningStats,

        // Individual gear contributions
        itemBreakdown: {
            armor: createItemBreakdown(armor),
            equipment: createItemBreakdown(equipment)
        },

        // Existing accessory data stays intact
        accessoryInfo: {
            count: accessories.length,
            items: accessories.map(accessory => ({
                id: accessory.id,
                name: accessory.name,
                rarity: accessory.rarity,
                modifier: accessory.modifier,
                rarityUpgrades: accessory.rarityUpgrades,
                stats: accessory.stats
            }))
        },

        profileInfo: {
            profileId,
            playerUUID: normalizedUUID
        }
    };
}

module.exports = {
    getMiningStats
};
