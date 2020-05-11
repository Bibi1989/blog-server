const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/posts/blogPost");
const { auth } = require("../controllers/auth/auth");
const router = express.Router();

/* GET home page. */
router.get("/posts", getPosts);

router.get("/posts/:postId", getPost);

router.post("/posts", auth, createPost);

router.patch("/posts/:updateId", auth, updatePost);

router.post("/likes", auth, likePost);

router.post("/comments/:commentId", auth, createComment);

router.patch("/comments/:postId", auth, updateComment);

router.delete("/comments/:postId", auth, deleteComment);

router.delete("/posts/:deleteId", auth, deletePost);

module.exports = router;
