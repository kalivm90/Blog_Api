const asyncHandler = require("express-async-handler");
const {body, validationResult} = require("express-validator");

const {signJWT, verifyJWT} = require("../util/jwtUtil.js");
const Cookie = require("../util/createCookie.js");
const User = require("../models/userModel.js");

exports.index = (req, res) => {
    res.json({
        message: "Welcome!",
    })
}

// local register post
exports.register_post = [
    body("firstName", "First name must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("lastName", "Last name must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("email", "Email must be valid.")
        .trim() 
        .isEmail()
        .escape(),
    body("username", "Username must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("password", "Password must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("confirmPassword").custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true 
    }).trim().escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req); 
        
        const existinUsername = await User.findOne({username: req.body.username}).exec();
    
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        })

        if (existinUsername) {
            res.status(409).json({
                success: false,
                error: "Username already exists.",
              });
        } else if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                error: "Field validation failed.",
                user: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                },
                errors: errors.array(),
            })
        } else {
            await newUser.save();

            const signedToken = await signJWT(newUser);

            // Create and attach cookie with the converted expiration of the JWT
            const cookie = new Cookie(res, signedToken);
            cookie.attachCookie();

            return res.status(200).json({
                    success: true,
                    message: "Successful Registeration",
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                    }
                });
        }
    })   
]


// local login post
exports.login_post = [
    body("username", "Username must be specified")
        .trim()
        .notEmpty() 
        .escape(),
    body("password", "Password must be specified")
        .trim()
        .notEmpty() 
        .escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // console.log("CONTROLLER REQ BODY", req.body);
        // console.log("CONTROLLER REQ HEADERS", req.headers);
        // console.log("CONTROLLER REQ METHOD", req.method);
        // console.log("CONTROLLER REQ URL", req.url);

        const user = await User.findOne({username: req.body.username}).exec();


        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Field validation failed.",
                username: req.body.username,
                errors: errors.array()
            })
        } else if (!user) {
            return res.status(409).json({
                success: false,
                error: "User does not exist",
            })
        }

        if (await user.isValidPassword(req.body.password)) {
            const signedToken = await signJWT(user);


            // Create and attach cookie with the converted expiration of the JWT
            const cookie = new Cookie(res, signedToken);
            cookie.attachCookie();


            return res.status(200).json({
                success: true,
                message: "Login Successful",
                user: {
                    id: user.id, 
                    username: user.username,
                },
                tokenExp: signedToken.expiresIn,
            });

        } else if (user?.googleId) {
            res.status(401).json({success: false, error: "This is a Goolge profile, please login with Google."})
        } else { 
            res.status(401).json({success: false, error: "You entered the wrong password"});
        }
    })
]


// update username post
exports.updateUsername_put = [
    body("username", "Username must be specified")
        .trim()
        .notEmpty() 
        .escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const verify = await verifyJWT(req.token);

        if (!verify.success) {
            return res.status(401).json({ 
                success: false, 
                message: "Unauthorized",
            });
        }

        const user = await User.findById(verify.authData.userPayload.id);


        if (user) {
            user.username = req.body.username;
            user.blogOwner = req.body.blogOwner;

            const updateduser = await user.save();

            const newToken = await signJWT(updateduser);

            // Create and attach cookie with the converted expiration of the JWT
            const cookie = new Cookie(res, newToken);
            cookie.attachCookie();


            res.status(200).json({
                success: true,
                message: "Login Succesful",
                user: {
                    id: updateduser.id, 
                    username: updateduser.username
                }
            })
        }
    })
]



// check is username exists in forms
exports.checkUsername_post = asyncHandler(async (req, res) => {
    const existingUsername = await User.findOne({username: req.body.value}).exec();

    if (existingUsername) {
        res.status(409).json({
            success: false, 
            message: "Username Taken",
        })
    } else {
        res.status(200).json({
            success: true,
            message: "Username Available"
        })
    }
})


// verifying user after OAuth redirect
exports.verifyGoogleUser_get = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);
    const user = await User.findById(verify.authData.userPayload.id);

    if (!verify.success || user === null) {
        return res.status(400).json({ 
            success: false, 
            error: "Something went wrong, please login again.",
        });
    } else {
        return res.status(200).json({
            success: true, 
            authData: verify.authData,
            tokenExp: process.env.JWT_EXPIRATION,
        })
    }
})