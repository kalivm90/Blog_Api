/********************************************************************
* 
*    This file consolidates all the routes under the API in 1 file    
*
*********************************************************************/

const express = require("express");
const router = express.Router();

const postRouter = require("./postRouter");
// const userRouter = require("./userRouter")

router.use("/posts", postRouter);

module.exports = router;