export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function lookupPlayer(username) {
    const response = await fetch(
        `${API_URL}/api/players/${encodeURIComponent(username)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Player lookup failed.");
    }

    return data;
}


export async function getSkyblockProfile(profileId) {
    const response = await fetch(
        `${API_URL}/api/skyblock/profile/${encodeURIComponent(profileId)}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Could not retrieve SkyBlock profile."
        );
    }

    return data.profile;
}

export async function getSkillResources() {
    const response = await fetch(
        `${API_URL}/api/skyblock/resources/skills`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve skill resources.");
    }

    return data.skills;
}

export async function getPlayerEquipment(profileId, uuid) {
    const response = await fetch(
        `${API_URL}/api/debug/equipment/${profileId}/${uuid}`
    );

    if (!response.ok) {
        throw new Error("Failed to retrieve player equipment.");
    }

    return await response.json();
}