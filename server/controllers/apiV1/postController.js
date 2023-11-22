const asyncHandler = require("express-async-handler");
const {verifyJWT, signJWT} = require("../../util/jwtUtil");
// this handles the encoding when a post is sent from the frontend to the backend
const he = require('he');

const debug = require('debug')('api:post');

const Post = require("../../models/postModel");
const User = require("../../models/userModel");

const { body, validationResult } = require("express-validator");


// sort by most recent
// exports.post_detail = asyncHandler(async (req, res) => {
    
//     const verify = await verifyJWT(req.token);

//     if (!verify.success) {
//         // If JWT verification fails, return an error response
//         return res.status(401).json({ 
//             success: false, 
//             error: "Not Authorized, please login.",
//         });
//     }

//     const posts = await Post.find()
//         .populate("author", "username")
//         .sort({timestamp: -1})
//         .limit(20)
//         .exec()

//     const userId = verify.authData.userPayload.id

//     const postsWithVirtuals = posts.map((post) => {
//         const likedByUser = post.likedByUser(userId);

//         return post.toJSON({
//             virtuals: true,
//             // Exclude virtuals for 'author'
//             transform: (doc, ret) => {
//                 if (ret.author) {
//                     delete ret.author.fullname;
//                     delete ret.author.userObj;
//                     delete ret.author.id;
//                 }
//                 if (ret.likes) {
//                     delete ret.likes.users;
//                 }
//                 ret.likedByUser = likedByUser;
//                 return ret;
//             }
//         });
//     });


//     if (posts.length > 0) {
//         return res.status(200).json({
//             success: true, 
//             posts: postsWithVirtuals,
//         })
//     } else {
//         return res.status(404).json({
//             success: true, 
//             message: "No Posts Found",
//             posts: null,
//         })
//     }
// })

// GET ALL POSTS
exports.posts_get = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);

    if (!verify.success) {
        return res.status(401).json({
            success: false,
            error: "Not Authorized, please login.",
        });
    }

    // sending 10 querys at a time
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (page - 1) * pageSize;

    // getting total number of pages
    const totalPostsCount = await Post.countDocuments();
    const totalPages = Math.ceil(totalPostsCount / pageSize);

    const posts = await Post.find()
        .populate("author", "username")
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();

    const userId = verify.authData.userPayload.id;

    const postsWithVirtuals = posts.map((post) => {
        const likedByUser = post.likedByUser(userId);

        return post.toJSON({
            virtuals: true,
            transform: (doc, ret) => {
                if (ret.author) {
                    delete ret.author.fullname;
                    delete ret.author.userObj;
                    delete ret.author.id;
                }
                if (ret.likes) {
                    delete ret.likes.users;
                }
                ret.likedByUser = likedByUser;
                return ret;
            },
        });
    });

    return res.status(200).json({
        success: true,
        posts: postsWithVirtuals,
        totalPages,
    });
});



// GET A SPECIFIC POST
exports.post_get = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);

    if (!verify.success) {
        return res.status(401).json({
            success: false, 
            error: "Not Authorized, please login.",
        })
    }

    const post = await Post.findById(req.params.id).populate("author", "username").exec()
    // const likes = await Like.find({"post": req.params.id}).populate("author", "username").exec();


    if (post === null) {

        return res.status(404).json({
            success: true,
            error: "Couldn't find that post."
        })

    } else {

        const userId = verify.authData.userPayload.id
        const liked = post.likes.users.includes(userId);

        const postsWithVirtuals = post.toJSON({
            virtuals: true,
            // Exclude virtuals for 'author'
            transform: (doc, ret) => {
                if (ret.author) {
                    delete ret.author.fullname;
                    delete ret.author.userObj;
                    delete ret.author.id;
                }
                // exclude likes.users
                if (ret.likes) {
                    delete ret.likes.users;
                }

                return ret;
            }
        });

        return res.status(200).json({
            success: true,
            liked,
            post: postsWithVirtuals,
        })
    }
})



// CREATE POST
exports.post_create_post = [
    body("title", "Title must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("body", "Body must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        // make sure user has auth
        const verify = await verifyJWT(req.token);

        if (!verify.success) {
            return res.status(401).json({
                success: false,
                error: "Not Authorized, please login.",
            })
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: true, 
                title: req.body.title,
                body: req.body.body,
                errors: errors.array(),
            })
        } else {
            const user = await User.findById(req.body.author, "_id").exec();

            if (!user) {
                return res.status(404).json({
                    success: false, 
                    error: "Could not find that user."
                })
            }   

            // decode html contenet 
            const decodedBody = he.decode(req.body.body);

            const newpost = new Post({
                title: req.body.title, 
                timestamp: Date.now(),
                body: decodedBody,
                author: user._id,
            })

            await newpost.save();
            
            res.status(200).json({
                success: true,
                message: "Post created successfully"
            })
        }
    })
]

// UPDATE GET 
exports.update_post_get = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);


    if (!verify.success) {
        return res.status(401).json({
            success: false, 
            error: "Not Authorized, please login.",
        })
    } else {
        const post = await Post.findById(req.params.id, "title body").exec();

        console.log("UPDATE GET", post);

        if (post === null) {
            res.status(404).json({
                success: false, 
                error: "Could not find post",
            })
        } else {
            res.status(200).json({
                success: true, 
                post,
            })
        }
    }
})

// UPDATE POST
exports.update_post_put = [
    body("title", "Title must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
    body("body", "Body must be specified")
        .trim()
        .isLength({min: 1})
        .escape(),
  
    asyncHandler(async (req, res) => {
        const verify = await verifyJWT(req.token);
        const errors = validationResult(req);

        if (!verify.success) {
            return res.status(403).json({
                success: false, 
                error: "Not Authorized, please login.",
            })
        } else if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: "Form is not filled out correctly",
                errors: errors.array(),
            })
        }

        const originalpost = await Post.findById(req.params.id);

        if (!originalpost) {
            return res.status(404).json({
                success: false,
                error: "Post not found.",
            })
        } else {

            const decodedBody = he.decode(req.body.body);

            const newpost = new Post({
                title: req.body.title,
                timestamp: originalpost.timestamp,
                body: decodedBody,
                author: req.body.author,
                _id: req.params.id,
            })

            await Post.findByIdAndUpdate(req.params.id, newpost, {})
    
            res.status(200).json({
                success: true,
                message: "Post Updated."
            })   
        }
    })
]

// DELETE POST
exports.post_delete = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);

    if (!verify.success) {
        return res.status(401).json({
            success: false, 
            error: "Not Authorized, please login.",
        })
    }

    const userid = verify?.authData.userPayload.id;
    const post = await Post.findById(req.params.id).populate("author", "id").exec();

    if (userid !== post.author.id) {
        return res.status(403).json({
            success: false,
            error: "That is not your post to delete."
        })
    } else if (post === null) {
        return res.status(404).json({
            success: false,
            error: "Post not found."            
        })
    } else {
        await Post.findByIdAndDelete(req.params.id).exec();

        return res.status(200).json({
            success: true, 
            message: "Post deleted successfully"
        })
    }
})


// like post (CLEAN THIS UP)
exports.post_like = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);

    if (!verify?.success) {
        return res.json({
            success: false, 
            error: "Not Authorized, please login.",
        })
    }

    const userId = verify.authData.userPayload.id

    const [post, user] = await Promise.all([
        Post.findById(req.params.id, "likes").exec(),
        User.findById(userId, "_id").exec(),
    ])

    if (post === null) {
        return res.json({
            success: false, 
            error: "Couldn't find that post."
        })
      // !post.likes.users.includes(user._id)
    } else if (user !== null && !post.likedByUser(user._id)) {
        // increment number of likes and add user id to users object
        post.likes.number = post.likes.number + 1;
        post.likes.users.push(user._id);
        await post.save();

        res.json({
            success: true,
            liked: true,
            likesTotal: post.likes.number,
            message: "Liked post."
        })

    }  else {
        // console.log("LIKED BY", post.likes.users);
        // console.log("USERID", user._id);

        res.json({
            success: false,
            liked: false,
            likesTotal: post.likes.number,
            message: "Whoops, something went wrong."
        })
    }
})

// dislike post (CLEAN THIS UP, redundant call to db for userId when its in jwtVerify)
exports.post_dislike = asyncHandler(async (req, res) => {
    const verify = await verifyJWT(req.token);

    if (!verify?.success) {
        return res.json({
            success: false, 
            error: "Not Authorized, please login.",
        })
    }

    const userId = verify.authData.userPayload.id

    const [post, user] = await Promise.all([
        Post.findById(req.params.id, "likes").exec(),
        User.findById(userId, "_id").exec(),
    ])


    if (post === null) {
        return res.json({
            success: false, 
            error: "Couldn't find that post."
        })
    } else if (user !== null && post.likes.users.includes(user._id)) {
        // decrement number of likes and remove user id from users object
        const userIdString = user._id.toString();
        post.likes.users = post.likes.users.filter(userId => userId.toString() !== userIdString);
        post.likes.number = post.likes.number - 1;
        await post.save();

        // console.log("DISLIKED BY", post.likes.users);
        // console.log("USERID", user._id);

        res.json({
            success: true,
            liked: false,
            likesTotal: post.likes.number,
            message: "Disliked post."
        })

    } else {
        res.json({
            success: true,
            // if something went wrong with this call than the like remains
            liked: true,
            likesTotal: post.likes.number,
            message: "Whoops, something went wrong."
        })
    }
})