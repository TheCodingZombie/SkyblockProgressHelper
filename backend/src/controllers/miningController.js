
const { getMiningStats } = require("../services/miningService");

const UUID_PATTERN = /^[a-f0-9]{32}$/i;
const PROFILE_ID_PATTERN =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

const CONSUMABLE_IDS = [
    "oreOats",
    "blockBran",
    "gemstoneGrahams",
    "metallicMinis"
];

async function getMiningStatsController(req, res) {
    try {
        const { profileId, uuid } = req.params;

        const normalizedUUID = uuid.replaceAll("-", "");

        if (!UUID_PATTERN.test(normalizedUUID)) {
            return res.status(400).json({
                error: "Invalid player UUID."
            });
        }

        if (!PROFILE_ID_PATTERN.test(profileId)) {
            return res.status(400).json({
                error: "Invalid profile ID."
            });
        }

        // Read and validate consumable counts.
        const consumables = {};

        for (const id of CONSUMABLE_IDS) {
            const rawValue = req.query[id] ?? "0";

            if (!/^\d+$/.test(String(rawValue))) {
                return res.status(400).json({
                    error: `Invalid consumable count: ${id}`
                });
            }

            const count = Number(rawValue);

            if (count < 0 || count > 5) {
                return res.status(400).json({
                    error: `${id} must be between 0 and 5.`
                });
            }

            consumables[id] = count;
        }

        const result = await getMiningStats({
            uuid: normalizedUUID,
            profileId,
            consumables
        });

        return res.json(result);

    } catch (error) {
        console.error("Mining controller error:", error);

        return res.status(500).json({
            error: error.message || "Unable to calculate Mining stats."
        });
    }
}

module.exports = {
    getMiningStatsController
};
