
const { getMiningStats } = require("./src/services/miningService");

const UUID = "c3b9402747b1433d8b20cd54c7da3f5d";
const PROFILE_ID = "739c8592-161c-47d2-a61f-25f246041967";

async function main() {
    const result = await getMiningStats({
        uuid: UUID,
        profileId: PROFILE_ID,

        consumables: {
            oreOats: 5,
            blockBran: 3,
            gemstoneGrahams: 2,
            metallicMinis: 0
        }
    });

    console.log("\n--- MINING STAT RESULTS ---");
    console.log(JSON.stringify(result, null, 2));
}

main().catch(error => {
    console.error("Mining stat test failed:", error);
});
