
export const MINING_CONTEXTS = [
    {
        id: "dwarvenMines",
        label: "Dwarven Mines",
        description: "Mining ores in the Dwarven Mines.",
        stats: [
            "Mining Speed",
            "Mining Fortune",
            "Dwarven Metal Fortune"
        ],
        conditionalKey: "dwarvenMetals"
    },
    {
        id: "crystalHollows",
        label: "Crystal Hollows",
        description: "Mining gemstones in the Crystal Hollows.",
        stats: [
            "Mining Speed",
            "Mining Fortune",
            "Gemstone Fortune",
            "Pristine"
        ],
        conditionalKey: "gemstones"
    },
    {
        id: "glaciteMineshafts",
        label: "Glacite Mineshafts",
        description: "Mining various resources in Glacite Mineshafts.",
        stats: [
            "Mining Speed",
            "Mining Fortune",
            "Ore Fortune",
            "Block Fortune",
            "Gemstone Fortune",
            "Dwarven Metal Fortune",
            "Pristine"
        ],
        conditionalKey: "mineshafts"
    },
    {
        id: "vanillaOres",
        label: "Vanilla Ores",
        description: "Mining vanilla ores.",
        stats: [
            "Mining Speed",
            "Mining Fortune",
            "Ore Fortune"
        ],
        conditionalKey: null
    },
    {
        id: "normalBlocks",
        label: "Blocks",
        description: "Mining normal blocks, such as red sand and end stone.",
        stats: [
            "Mining Speed",
            "Mining Fortune",
            "Block Fortune"
        ],
        conditionalKey: null
    }
];
