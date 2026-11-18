const TEXTURE_BASE_URL = "https://cdn.skytools.app/items";

export function getItemTextureUrl(itemId) {
    if (!itemId) {
        return null;
    }

    const normalizedId = String(itemId)
        .trim()
        .toUpperCase();

    if (!normalizedId) {
        return null;
    }

    return `${TEXTURE_BASE_URL}/${encodeURIComponent(normalizedId)}.png`;
}