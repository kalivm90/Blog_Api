// verify token - this is a middleware token that gets hit before it is passed to the controller and seperates the token from the header
function verifyRoute(req, res, next) {
    // Instead of looking in the header we are looking in the included cookies for the token
    const bearerHeader = req.cookies.access_token.token;

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        // adding the token to the request
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(401);
    }
}

module.exports = {verifyRoute};