
import { API_URL } from "./hypixelService";

const DEFAULT_CONSUMABLES = {
    oreOats: 0,
    blockBran: 0,
    gemstoneGrahams: 0,
    metallicMinis: 0
};

export async function getMiningStats(
    profileId,
    uuid,
    consumables = {}
) {
    if (!profileId || !uuid) {
        throw new Error("Player UUID and profile ID are required.");
    }

    // Combine supplied counts with defaults.
    const counts = {
        ...DEFAULT_CONSUMABLES,
        ...consumables
    };

    // Convert consumable counts into URL query parameters.
    const params = new URLSearchParams();

    for (const [id, count] of Object.entries(counts)) {
        params.set(id, String(count));
    }

    const response = await fetch(
        `${API_URL}/api/skyblock/mining/${encodeURIComponent(profileId)}/${encodeURIComponent(uuid)}?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to retrieve Mining statistics."
        );
    }

    return data;
}
