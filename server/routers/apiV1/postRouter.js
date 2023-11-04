const express = require("express");
const router = express.Router();

const { verifyRoute } = require("../../middleware/jwtMiddleware");
const postController = require("../../controllers/apiV1/postController");

// all routes require authorization
router.use(verifyRoute);

// get all posts: this is /posts
router.get("/", postController.post_detail);

// post create
router.get("/createPost", postController.post_create_get)
router.post("/createPost", postController.post_create_post)

// get all specific post 
router.get("/:id", postController.post_get);

// update specific post
router.get("/:id/update", postController.update_post_get);
router.put("/:id/update", postController.update_post_put);

// delete post
router.delete("/:id/delete", postController.post_delete);

// like post 
router.post("/:id/like", postController.post_like);
router.post("/:id/dislike", postController.post_dislike);

module.exports = router;