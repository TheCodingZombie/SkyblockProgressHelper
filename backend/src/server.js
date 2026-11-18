
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const {
    getPlayerByUsername
} = require("./services/minecraftService");

const {
    getPlayerProfiles,
    getProfile,
    getSkillResources
} = require("./services/hypixelService");

const {
    decodeInventoryContents
} = require("./utils/inventoryDecoder");

const { parseItem } = require("./utils/itemParser");

const miningRoutes = require("./routes/miningRoutes");

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN =
    process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({
    origin: FRONTEND_ORIGIN
}));

app.use(express.json());

app.use("/api/skyblock/mining", miningRoutes);

// Simple health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "online",
        message: "Skyblock Progress Helper backend is running."
    });
});

// Resolve a Minecraft username and retrieve its SkyBlock profiles.
app.get("/api/players/:username", async (req, res) => {
    try {
        // First, resolve the username into a UUID.
        const player = await getPlayerByUsername(
            req.params.username
        );

        // Next, retrieve all of the player's SkyBlock profiles.
        const result = await getPlayerProfiles(player.uuid);

        // Return a simplified response for the frontend.
        const profiles = (result.data.profiles || []).map(profile => ({
            profileId: profile.profile_id,
            cuteName: profile.cute_name,
            gameMode: profile.game_mode || "normal",
            selected: profile.selected || false
        }));

        res.json({
            player,
            profiles
        });

    } catch (error) {
        console.error("Player lookup failed:", error.message);

        res.status(error.status || 500).json({
            error: error.message
        });
    }
});

// Retrieve all SkyBlock profiles belonging to a player.
app.get("/api/skyblock/profiles/:uuid", async (req, res) => {
    try {
        const result = await getPlayerProfiles(req.params.uuid);

        res.json({
            profiles: result.data.profiles || [],
            rateLimit: result.rateLimit
        });
    } catch (error) {
        console.error("Profile request failed:", error.message);

        const status = error.status || (
            error.message.includes("Invalid Minecraft UUID.") ? 400 : 500
        );

        res.status(status).json({
            error: error.message,
            rateLimit: error.rateLimit || null
        });
    }
});

// Retrieve the full data for a selected SkyBlock profile.
app.get("/api/skyblock/profile/:profileId", async (req, res) => {
    try {
        const result = await getProfile(req.params.profileId);

        res.json({
            profile: result.data.profile,
            rateLimit: result.rateLimit
        });
    } catch (error) {
        console.error("Profile request failed:", error.message);

        const status = error.status || (
            error.message.includes("Invalid SkyBlock profile ID.") ? 400 : 500
        );

        res.status(status).json({
            error: error.message,
            rateLimit: error.rateLimit || null
        });
    }
});

app.get("/api/skyblock/resources/skills", async (req, res) => {
    try {
        const result = await getSkillResources();

        res.json({
            skills: result.data.skills
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


app.get("/api/debug/equipment/:profileId/:uuid", async (req, res) => {
    try {
        const result = await getProfile(req.params.profileId);

        const normalizedUUID = req.params.uuid
            .replaceAll("-", "")
            .toLowerCase();

        const memberEntry = Object.entries(
            result.data.profile?.members ?? {}
        ).find(([uuid]) =>
            uuid.replaceAll("-", "").toLowerCase() === normalizedUUID
        );

        if (!memberEntry) {
            return res.status(404).json({
                error: "Player not found in profile."
            });
        }

        const member = memberEntry[1];
        const inventory = member.inventory;

        const armor = await decodeInventoryContents(
            inventory?.inv_armor?.data
        );

        const equipment = await decodeInventoryContents(
            inventory?.equipment_contents?.data
        );

        const talismanBag = await decodeInventoryContents(
            inventory?.bag_contents?.talisman_bag?.data
        );

        function summarizeItems(decodedInventory) {
            const items = [];

            function findItems(value) {
                if (!value || typeof value !== "object") return;

                if (Array.isArray(value)) {
                    value.forEach(findItems);
                    return;
                }

                if (value.tag?.ExtraAttributes) {
                    items.push(parseItem(value));
                    return;
                }

                Object.values(value).forEach(findItems);
            }

            findItems(decodedInventory?.data ?? decodedInventory);

            return items;
        }

        res.json({
            armor: summarizeItems(armor?.data),
            equipment: summarizeItems(equipment?.data),
            talismans: summarizeItems(talismanBag?.data),

            accessoryStorage: member.accessory_bag_storage
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
