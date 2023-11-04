const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
require("dotenv").config();

const {signJWT} = require("../util/jwtUtil.js"); 

const User = require("../models/userModel.js");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            // Change this to .env variable
            // callbackURL: "http://localhost:5000/auth/google/callback",
            callbackURL: `${process.env.SERVER_DOMAIN}/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails && emails.length > 0 ? emails[0].value : null;

                let user = await User.findOne({googleId: id});
                
                if (!user) {
                    const fullname = displayName.split(" ")
                    const hashedPassword = await bcrypt.hash(displayName, 10);

                    user = new User({
                        firstName: fullname[0],
                        lastName: fullname[1],
                        // username: displayName, 
                        username: null,
                        password: displayName+hashedPassword+email,
                        googleId: id,
                        email: email, 
                    })

                    await user.save();

                    return done(null, user, {redirectTo: `${process.env.CLIENT_DOMAIN}/auth/updateUsername`});
                }

                done(null, user);
            } catch (err) {
                done(err);
            }
        }
    )
)

module.exports = passport;