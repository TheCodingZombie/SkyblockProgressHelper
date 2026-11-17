export function calculateUpgrades(skill, playerData) {

    switch (skill.id) {

        case "mining":
            return calculateMiningUpgrades(playerData);

        case "foraging":
            return calculateForagingUpgrades(playerData);

        case "fishing":
            return calculateFishingUpgrades(playerData);

        default:
            return [];
    }
}

function calculateMiningUpgrades(playerData) {
    const recommendations = [];

    // Mining-specific recommendation rules go here.

    return recommendations;
}

function calculateForagingUpgrades(playerData) {
    const recommendations = [];

    // Foraging-specific recommendation rules go here.

    return recommendations;
}

function calculateFishingUpgrades(playerData) {
    const recommendations = [];

    // Fishing-specific recommendation rules go here.

    return recommendations;
}