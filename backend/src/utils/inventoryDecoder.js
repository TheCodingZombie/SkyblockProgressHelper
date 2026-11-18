
const nbt = require("prismarine-nbt");

async function decodeInventoryContents(encodedData) {
    if (!encodedData) {
        return null;
    }

    try {
        const buffer = Buffer.from(encodedData, "base64");

        const { parsed, type } = await nbt.parse(buffer);

        const simplified = nbt.simplify(parsed);

        return {
            nbtType: type,
            data: simplified
        };

    } catch (error) {
        console.error("NBT decoding failed:", error);
        throw new Error("Unable to decode inventory data.");
    }
}

module.exports = {
    decodeInventoryContents
};
