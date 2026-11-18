const PET_HEAD_TEXTURES = {
    ARMADILLO: "c1eb6df4736ae24dd12a3d00f91e6e3aa7ade6bbefb0978afef2f0f92461018f",
    BAT: "382fc3f71b41769376a9e92fe3adbaac3772b999b219c9d6b4680ba9983e527",
    SILVERFISH: "da91dab8391af5fda54acd2c0b18fbd819b865e1a8f1d623813fa761e924540",
    WITHER_SKELETON: "f5ec964645a8efac76be2f160d7c9956362f32b6517390c59c3085034f050cff",
    ENDERMITE: "5a1a0831aa03afb4212adcbb24e5dfaa7f476a1173fce259ef75a85855",
    ROCK: "cb2b5d48e57577563aca31735519cb622219bc058b1f34648b67b8e71bc0fa",
    MITHRIL_GOLEM: "c1b2dfe8ed5dffc5b1687bc1c249c39de2d8a6c3d90305c95f6d1a1a330a0b1",
    BAL: "c469ba2047122e0a2de3c7437ad3dd5d31f1ac2d27abde9f8841e1d92a8c5b75",
    SCATHA: "df03ad96092f3f789902436709cdf69de6b727c121b3c2daef9ffa1ccaed186c",
    SNAIL: "50a9933a3b10489d38f6950c4e628bfcf9f7a27f8d84666f04f14d5374252972",
    GOBLIN: "7309d8dc35a638a04b915a3b15a1452ceeae0d7ea42bcdadb21b03046987515c",
    MOLE: "727baaafc09978d4bda73e16afdde85ec13b0f95ad989524c5fcaa717cf06b4a",
    GLACITE_GOLEM: "af132a6593876d3c377d503fd66eca3fb938743251f7b16a9870c60b7388c8a3"
};

const PET_HEAD_BASE_URL = "https://sky.shiiyu.moe/api/head";

export function getPetTextureUrl(petType) {
    if (!petType) return null;

    const normalizedType = String(petType)
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_");

    const textureHash = PET_HEAD_TEXTURES[normalizedType];

    if (!textureHash) return null;

    return `${PET_HEAD_BASE_URL}/${textureHash}`;
}