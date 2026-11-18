
const { getProfile } = require("./hypixelService");

const { decodeInventoryContents } = require("../utils/inventoryDecoder");
const { parseItem } = require("../utils/itemParser");
const { findInventoryItems, parseAccessoryBag } = require("../utils/accessoryStats");
const { calculateMiningStats } = require("../utils/miningStats");

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
