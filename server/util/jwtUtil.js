const jwt = require('jsonwebtoken');
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const pathToKey = path.join(__dirname, "../config/id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");


function signJWT(payload) {
    
    const expiresIn = process.env.JWT_EXPIRATION

    const userPayload = {
        id: payload._id,
        username: payload.username,
        blogOwner: payload.blogOwner,
    }

    if (payload?.googleId) {
        userPayload.googleId = payload.googleId
    }

    return new Promise((resolve, reject) => {
        jwt.sign({userPayload}, PRIV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'}, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    success: true,
                    token: `Bearer ${token}`,
                    expiresIn: expiresIn,
                })
            }
        })
    })
}

function verifyJWT(token) {

    return new Promise((resolve, reject) => {
        jwt.verify(token, PRIV_KEY, (err, authData) => {
            if (err) {
                resolve({
                    success: false,
                    message: "JWT Verification Failed",
                    error: err.message,
                })
            } else {
                resolve({
                    success: true,
                    authData
                })
            }
        })
    })
}


module.exports = {signJWT, verifyJWT};