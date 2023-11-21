const express = require("express");
const router = express.Router();

const {verifyRoute} = require("../middleware/jwtMiddleware.js");
const {verifyJWT, signJWT} = require("../util/jwtUtil.js");
const Cookie = require("../util/createCookie.js");

const authController = require("../controllers/authController.js");
const passport = require("passport");

// index api for test, will get rid of this 
router.get("/", authController.index);

// Register Post
router.post("/register", authController.register_post);
// Login Post
router.post("/login", authController.login_post)

router.post("/checkUsername", authController.checkUsername_post);

// GOOGLE - Put it here instead of a controller
router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}))

router.get(
    "/google/callback",
    passport.authenticate("google", {session: false}),
    async (req, res) => {
        if (req.authInfo instanceof Error) {
            // redirect back to login with url parameter
            console.error("Error in google callback /google/callback", err);
            return res.json({
                success: false,
                message: "Something went wrong during Authentication",
            })
        }

        const token = await signJWT(req.user);
        const cookie = new Cookie(res, token);
        cookie.attachCookie();

        if (req.authInfo && req.authInfo.redirectTo) {
            return res.redirect(req.authInfo.redirectTo);
        }

        // res.redirect(process.env.CLIENT_DOMAIN + "/blog/dashboard");
        res.redirect(process.env.CLIENT_DOMAIN + "/auth/googleCallback");
    }
);


// route that handles frontend updating of username after the google auth succeeds 
router.put("/updateUsername", verifyRoute, authController.updateUsername_put);

// this handles the end of the google auth process by checking that the auth succeeded before authorizing 
router.get("/verifyGoogleUser", verifyRoute, authController.verifyGoogleUser_get);

module.exports = router