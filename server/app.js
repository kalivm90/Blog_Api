const express = require("express");
const createError = require('http-errors');
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
// Connects to mongoDB (this just needs to be imported to run)
const mongoConfig = require("./mongoConfig");

// Prod Config Imports
const logger = require('morgan');
const debug = require("debug")("app")
const compression = require("compression");
const helmet = require("helmet");



const app = express();

const authRouter = require("./routers/authRouter");
const apiV1Router = require("./routers/apiV1/_index");

const passport = require("./middleware/passportMiddleware");

// settting CORS to accept only requests from the client domain
app.use(
    cors({
        origin: process.env.CLIENT_DOMAIN,
        credentials: true,
    })
);


app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// setting up parser for incoming cookies
app.use(cookieParser());


// Production Config
app.use(compression());
app.use(helmet());

                // Just in case rate limiting is needed
/* 
    // Set up rate limiter: maximum of twenty requests per minute
    const RateLimit = require("express-rate-limit");

    const limiter = RateLimit({
        windowMs: 1 * 60 * 1000, 
        max: 20,
    });
    
    // Apply rate limiter to all requests
    app.use(limiter); 
*/


app.use("/auth", authRouter);
app.use("/api/v1", apiV1Router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        error: err.message,
        forDeveloper: "This is being caught in the main error handler. If you expected this error to be something else, debug the specific function"
    })
});

/*******************************************************************
*
*   if you need new mongo connection config got to ./mongoConfig.js
*   this is the old way
*   
********************************************************************/

/* 
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(mongoDB);
} 
*/

module.exports = app;