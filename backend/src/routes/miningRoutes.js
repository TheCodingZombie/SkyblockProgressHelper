
const express = require("express");

const {
    getMiningStatsController
} = require("../controllers/miningController");

const router = express.Router();

router.get("/:profileId/:uuid", getMiningStatsController);

module.exports = router;
