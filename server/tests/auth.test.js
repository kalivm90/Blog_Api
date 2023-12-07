const request = require("supertest");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const {parseErrorMessage} = require("./helpers");
// Express + Routes
const app = express();
const authRouter = require("../routers/authRouter");
// Database 
const { initializeMongoServer, disconnectMongoServer } = require("./mongo/mongoConfigTesting");
const User = require("../models/userModel");

// Server Middleware
app.use(
    cors({
        origin: process.env.CLIENT_DOMAIN,
        credentials: true,
    })
);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setting up /auth route
app.use("/auth", authRouter)




let factories;

// Initialize database and fill with mock data before all tests
beforeAll(async () => {
    factories = await initializeMongoServer();
});

// Disconnect database before all tests
afterAll(async () => {
    await disconnectMongoServer();
});



/*********************
*                    *
*   Register Tests   *
*                    *
**********************/

describe("Register Routes", () => {

    test("Registers a new user successfully", async () => {
        // Get a test user
        const credentials = factories.userFactory.newUser;
        // Make the request and wait for the response
        const response = await request(app)
            .post("/auth/register")
            .set('Content-Type', 'application/json')
            .send(credentials)
        // Check the response
        expect(response.status).toBe(200);
        // Query the database to check if the new user was created
        const user = await User.findOne({ username: credentials.username }).exec();
        // Expect that the user is now in the database as all usernames are unique.
        expect(user.username).toBe(credentials.username);
        // Delete user from DB so it can be re-used later
        await user.deleteOne()
    })
    
    
    test("Catches missing field in Registration fields", async() => {
        // Get a test user
        const credentials = factories.userFactory.newUser;
        // Delete password feild
        delete credentials.password 
        // Send response 
        const response = await request(app)
            .post("/auth/register")
            .set("Content-Type", "application/json")
            .send(credentials);
        // Check response
        expect(response.status).toBe(400);
    
        // Check response body for "password" feild validation error
        const isKeywordInError = parseErrorMessage(response, "password", true);
        // Check response body for "password" feild validation error
        expect(isKeywordInError).toBeDefined();
    })
    
    
    test("User registers with a username already taken", async() => {
        // Selecting a new user
        const newUserCredentials = factories.userFactory.newUser;
        // Selecting a existing user
        const existinguser = factories.userFactory.singleUser;
        // Giving the new user the same username as the existing user
        newUserCredentials.username = existinguser.username;
        // Make response to /register
        const response = await request(app)
            .post("/auth/register")
            .set("Content-Type", "application/json") 
            .send(newUserCredentials)
        // Check response status
        expect(response.status).toBe(409);
    
        // Parse error "message" for keyword username
        const isKeywordInError = parseErrorMessage(response, "username");
        // Check if "username" in the error message
        expect(isKeywordInError).toBeTruthy();
    })

})

/******************
*                 *
*   Login Tests   *
*                 *
*******************/

describe("Login Routes", () => {

    test("Logs in with valid credentials", done => {
        // Getting a single user from the factory
        const {username, password} = factories.userFactory.singleUser    
        // Crafting login fields
        const credentials = {
            username, 
            password
        }
        // Sending request
        request(app)
            .post("/auth/login")
            .set('Content-Type', 'application/json')
            .send(credentials)
            .expect(200, done);
    });
    
    
    test("Does not login with unknown username", async() => {
        // Getting new user that has no credentails
        const {username, password} = factories.userFactory.newUser;
        // Creating credentials to send in request
        const credentials = {
            username,
            password
        }
        // Making request to /auth/login
        const response = await request(app)
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send(credentials)
        // Checking response status 
        expect(response.status).toBe(409);
    
        // Check response body for "user" in error message
        const isKeywordInError = parseErrorMessage(response, "user");
        // Check if "user" in the error message
        expect(isKeywordInError).toBeTruthy();
    })
    
    
    test("Does not login with incorrect password", async() => {
        // Getting valid username
        const username = factories.userFactory.singleUser.username;
        // Getting a wrong password
        const wrongPassword = factories.userFactory.newUser.password;
        // Creating credentials to send with request
        const credentails = {
            username,
            password: wrongPassword,
        }
        // Make request to /auth/login
        const response = await request(app)
            .post("/auth/login")
            .set("Content-Type", "application/json")
            .send(credentails)
        // Check status
        expect(response.status).toBe(401);
        // Check response body for "password" in error message
        const isKeywordInError = parseErrorMessage(response, "password");
        // Check if "password" in the error message
        expect(isKeywordInError).toBeTruthy();
    })
    
})