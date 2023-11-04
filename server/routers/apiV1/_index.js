const express = require("express");
const router = express.Router();

const postRouter = require("./postRouter");

router.use("/posts", postRouter)

module.exports = router;