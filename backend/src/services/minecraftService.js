
const MINECRAFT_API_BASE =
    "https://api.mojang.com/users/profiles/minecraft";

async function getPlayerByUsername(username) {
    const trimmedUsername = username.trim();

    // Minecraft Java usernames must be 3-16 characters.
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(trimmedUsername)) {
        const error = new Error("Invalid Minecraft username.");
        error.status = 400;
        throw error;
    }

    const response = await fetch(
        `${MINECRAFT_API_BASE}/${encodeURIComponent(trimmedUsername)}`
    );

    // Mojang returns 204 when no player matches.
    if (response.status === 204 || response.status === 404) {
        const error = new Error("Minecraft player not found.");
        error.status = 404;
        throw error;
    }

    if (response.status === 429) {
        const error = new Error(
            "Minecraft profile lookup is temporarily rate limited."
        );
        error.status = 429;
        throw error;
    }

    if (!response.ok) {
        const error = new Error(
            `Minecraft profile lookup failed (${response.status}).`
        );
        error.status = 502;
        throw error;
    }

    const data = await response.json();

    if (!data.id || !data.name) {
        const error = new Error(
            "Minecraft returned incomplete player information."
        );
        error.status = 502;
        throw error;
    }

    return {
        username: data.name,
        uuid: data.id
    };
}

module.exports = {
    getPlayerByUsername
};
