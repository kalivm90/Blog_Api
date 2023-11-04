require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const process = require("process");

const User = require("../../models/userModel");
const Post = require("../../models/postModel");

// arrays for relation linking
const usersArray = []
const postArray = []
const likeArray = []

const mongoDB = process.env.MONGODB_URI;
// call main
main();


async function main() {
    const argv = process.argv;
    const argc = argv.length;

    if (argc < 3 || argc > 3) {
        console.log(`Usage: node populatedb.js populate/clear`)
        return;
    } 

    const keyWord = argv[2];

    switch (keyWord.trim().toLowerCase()) {
        case "populate":
            await populate();
            break;
        case "clear": 
            await clear();
            break;
        default:
            console.log(`Usage: node populatedb.js populate/clear`)
            break;

    }
}

async function clear() {
    try {
        console.log("Debug: About to connect...");
        await mongoose.connect(mongoDB);
        console.log("Debug: Dropping...");
        await User.collection.drop();
        await Post.collection.drop();
        // await Like.collection.drop();
        console.log("Debug: all tables dropped");
    } catch (err) {
        console.log(`Main Error: ${err}`);
    } finally {
        await mongoose.connection.close();
        console.log("\nDebug: Complete! Closing connection...\n");
    }
}

async function populate() {
    try {
        console.log("Debug: About to connect...");
        await mongoose.connect(mongoDB);
        console.log("Debug: Should be connected\n");

        await createUsers().catch((err) => console.log("Create Users Error: ", err));
        await createPosts().catch((err) => console.log("Create Posts Error: ", err));
        
        // console.log(usersArray[0]);
        // console.log(postArray[0]); 

    } catch (err) {
        console.log(`Main Error: ${err}`);
    } finally {
        mongoose.connection.close();
        console.log("\nDebug: Complete! Closing connection...\n");
    }
}


// create all users/posts
async function createUsers() {
    await Promise.all([
        userCreate("Bobby", "Dillon", "bobby90", "bob@gmail.com", "bobby90", false),
        userCreate("Jill", "Swanson", "jill90", "jill@gmail.com", "jill90"),
        userCreate("Sammy", "Samuel", "samy90", "sam@gmail.com", "samy90", false, "1232223")
    ])
}

async function createPosts() {
    await Promise.all([
        postCreate(
            "The day I was born",
            `<h1>Test post:</h1><p><br></p><ol><li>this is simply a test to check if everything works correctly</li><li>please do not use this in production</li></ol><p><br></p><p><br></p><p><strong style="color: rgb(255, 153, 0);">Very nice! </strong><strong style="color: rgb(255, 255, 255);">white text &lt;- </strong><strong style="color: rgb(230, 0, 0);">white text here </strong></p>`,
            usersArray[1],
            {
                number: 1,
                users: [usersArray[2]]
            }
        ),
        postCreate(
            "Today sucks",
            `<h1>Another test:</h1><p><br></p><blockquote>"here is a quote"</blockquote><p><br></p><pre class="ql-syntax" spellcheck="false">import test from ./test.py
    
            def main():
              return "test"
            
            if __name__ == "__main__":
              main()
            </pre><p><br></p><p><br></p><p><strong style="color: rgb(255, 153, 0);">Very nice! </strong><strong style="color: rgb(255, 255, 255);">white text &lt;- </strong><strong style="color: rgb(230, 0, 0);">white text here </strong></p>`, 
            usersArray[0],
            {
                number: 1,
                users: [usersArray[1], usersArray[2]]
            }
        ),
        postCreate(
            "ITS HUMP DAY", 
            `<h1><span class="ql-font-georgia">last test</span>:</h1><p><br></p><p><span class="ql-font-lucida">This is in another font </span><span class="ql-font-lucida ql-size-large">Size difference. </span><strong class="ql-font-lucida ql-size-extra-small" style="color: rgb(178, 178, 0);">small bold</strong></p><p><br></p><p><br></p><p><strong style="color: rgb(255, 153, 0);">Very nice! </strong><strong style="color: rgb(255, 255, 255);">white text &lt;- </strong><strong style="color: rgb(230, 0, 0);">white text here </strong></p>`, 
            usersArray[2],
            {
                number: 1,
                users: [usersArray[1]]
            }
        )  
    ])
}


// create single user/post
async function userCreate(firstName, lastName, username, email, password, blogOwner=true, googleId=null) {

    const newuser = new User ({
        firstName: firstName, 
        lastName: lastName,
        username: username,
        email: email, 
        password: password,
        blogOwner: blogOwner,
    })

    if (googleId !== null) {
        newuser.googleId = googleId;
    }

    await newuser.save();
    usersArray.push(newuser);
    console.log(`Added User: ${firstName} ${lastName}`);
}   


async function postCreate(title, body, author, likes={number: 1, users: []}, timestamp=null) {
    // if there are items in the users array increment number by length of users and pull ids from the user objects 
    if (likes.users.length > 0) {
        likes.number += likes.users.length
        const newusers = likes.users.map(user => user.id)

        likes = {
            ...likes,
            users: newusers,
        }
    }

    const newpost = new Post({
        title: title, 
        body: body, 
        author: author,
        likes: likes,
    })    

    // timestamp is added automatically to db
    if (timestamp !== null) {
        newpost.timestamp = timestamp;
    } 

    await newpost.save();
    postArray.push(newpost);
    console.log(`Added Post: ${title}, From Author ${author.username}`);
}
