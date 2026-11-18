require("dotenv").config();

const HYPIXEL_API_BASE = "https://api.hypixel.net/v2";

function getApiKey() {
    const apiKey = process.env.HYPIXEL_API_KEY;

    if (!apiKey) {
        throw new Error("Hypixel API key is not configured.");
    }

    return apiKey;
}

async function hypixelRequest(endpoint) {
    const response = await fetch(`${HYPIXEL_API_BASE}${endpoint}`, {
        method: "GET",
        headers: {
            "API-Key": getApiKey()
        }
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        const error = new Error(
            data.cause || `Hypixel API request failed (${response.status}).`
        );

        error.status = response.status;
        error.rateLimit = {
            limit: response.headers.get("RateLimit-Limit"),
            remaining: response.headers.get("RateLimit-Remaining"),
            reset: response.headers.get("RateLimit-Reset")
        };

        throw error;
    }

    return {
        data,
        rateLimit: {
            limit: response.headers.get("RateLimit-Limit"),
            remaining: response.headers.get("RateLimit-Remaining"),
            reset: response.headers.get("RateLimit-Reset")
        }
    };
}

async function getPlayerProfiles(uuid) {
    if (!/^[0-9a-f]{32}$/i.test(uuid.replaceAll("-", ""))) {
        throw new Error("Invalid Minecraft UUID.");
    }

    const result = await hypixelRequest(
        `/skyblock/profiles?uuid=${encodeURIComponent(uuid)}`
    );

    return result;
}

async function getProfile(profileId) {
    if (!/^[0-9a-f-]{36}$/i.test(profileId)) {
        throw new Error("Invalid SkyBlock profile ID.");
    }

    const result = await hypixelRequest(
        `/skyblock/profile?profile=${encodeURIComponent(profileId)}`
    );

    return result;
}

async function getSkillResources() {
    return hypixelRequest("/resources/skyblock/skills");
}

module.exports = {
    getPlayerProfiles,
    getProfile,
    getSkillResources
}
