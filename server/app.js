const express = require("express");
const createError = require('http-errors');
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require('morgan');
const debug = require("debug")("app")

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


/* 
    MAY WANT TO ADD /api/ TO ALL ROUTES V1 OPTIONAL

    app.use("api/v1/auth", authRouter);
    app.use("api/v1/posts", postRouter);
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

const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err))

async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;