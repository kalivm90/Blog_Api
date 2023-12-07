const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const User = require("../../models/userModel");
const Post = require("../../models/postModel");

const { PostFactory, UserFactory } = require("./mockData");

let mongoServer;

/* Initiates db server and fills with mock data */
async function initializeMongoServer() {
    await connectMongoServer();
    console.log("Putting mock data in the database...")

    // Getting user data from UserFactory
    const userData = new UserFactory();
    await User.create(userData.allUsers);

    // Query all user ids to pass to PostFactory
    const mockUsers = await User.find().select("_id").exec();

    // Getting post data with user ids as arguments
    const postData = new PostFactory(mockUsers);
    await Post.create(postData.allPosts);


    /*  
    *   Return factories to be used in the test files
    *
    *   Not sure if this is even neccessary but its good 
    *   to have in case its needed
    */

    return {userFactory: userData, postFactory: postData};
}


/* Connects to the server */
async function connectMongoServer() {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    mongoose.connect(mongoUri);

    mongoose.connection.on("error", e => {
        if (e.message.code === "ETIMEDOUT") {
            console.log(e);
            mongoose.connect(mongoUri);
        }
        console.log(e);
    })

    mongoose.connection.once("open", async () => {
        console.log(`MongoDB successfully connected to ${mongoUri}`);
    })
}

/* Disconnects the server */
async function disconnectMongoServer() {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log(`Connection closed...`);
}

module.exports = {initializeMongoServer, disconnectMongoServer};










// OG way of starting server

// const { getUserData, getPostData } = require("./mockData");

/* Initiates db server and fills with mock data */
// async function initializeMongoServer() {
//     await connectMongoServer();
//     console.log("Putting mock data in the database...")

//     const userData = getUserData();
//     await User.create(userData);

//     const mockUsers = await User.find().select("_id").exec();

//     // Getting post data with users as arguments
//     const postData = getPostData(mockUsers);
//     await Post.create(postData)
// }
