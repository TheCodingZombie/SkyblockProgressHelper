const API_URL = import.meta.env.VITE_API_URL;

export async function getPlayerProfiles(uuid) {
    const response = await fetch(
        `${API_URL}/profiles?uuid=${encodeURIComponent(uuid)}`
    );

    if (!response.ok) {
        throw new Error(
            `API request failed: ${response.status}`
        );
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(
            data.cause || "Hypixel API request unsuccessful"
        );
    }

    return data.profiles;
}