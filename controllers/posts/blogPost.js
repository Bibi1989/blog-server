const Posts = require("../../models/postModel");

// get all posts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 });
    return res.json({ status: "success", data: posts });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// get a single post
module.exports.getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId);
    return res.json({ status: "success", data: post });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// create a post
module.exports.createPost = async (req, res) => {
  const { username, email, id } = await req.user;
  const { body } = req.body;
  const error = validatePost(body);
  if (error.body)
    return res.status(404).json({ status: "error", error: error.body });
  try {
    const post = new Posts({
      id,
      body,
      username,
      email,
    });
    await post.save();
    return res.json({ status: "success", data: post });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// update a post
module.exports.updatePost = async (req, res) => {
  const { username, email, id } = await req.user;
  try {
    const { updateId } = req.params;
    const { body } = req.body;
    const error = validatePost(body);
    if (error.body)
      return res
        .status(404)
        .json({ status: "error", error: "Input field is empty" });
    const updateObj = {
      id,
      body,
      username,
      email,
      createdAt: new Date().toISOString(),
    };
    const post = await Posts.findByIdAndUpdate(updateId, updateObj, {
      new: true,
    });
    res.json({ status: "success", data: post });
  } catch (error) {}
};

// delete a post
module.exports.deletePost = async (req, res) => {
  try {
    const { deleteId } = req.params;
    const deleted = await Posts.findByIdAndDelete(deleteId);
    if (!deleted)
      return res.status(404).json({ status: "error", error: "User not found" });
    return res.json({ status: "success", data: "Deleted Successfully" });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// like a post
module.exports.likePost = async (req, res) => {
  const user = await req.user;
  try {
    const id = req.body.id;
    console.log(id);
    const posts = await Posts.findById(id);
    if (posts) {
      if (posts.likes.find((like) => like.username === user.username)) {
        posts.likes = posts.likes.filter(
          (like) => like.username !== user.username
        );
      } else {
        posts.likes.push({
          username: user.username,
          createdAt: new Date().toISOString(),
        });
      }
      await posts.save();
      res.json({
        status: "success",
        data: posts,
        likeCount: posts.likes.length,
      });
    } else {
      throw new UserInputError("Post is not found");
    }
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// create comments
module.exports.createComment = async (req, res) => {
  const user = await req.user;
  const { body } = req.body;
  const { commentId } = req.params;
  console.log({ body, commentId });
  try {
    if (body === "") {
      return res
        .status(404)
        .json({ status: "error", error: "Comment field is empty" });
    }

    const post = await Posts.findById(commentId);

    if (post) {
      post.comments.unshift({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      await post.save();
      res.json({
        status: "success",
        data: post,
        commentsCount: post.comments.length,
      });
    } else {
      res.status(404).json({ status: "error", error: "Post do not exist" });
    }
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// delete comments
module.exports.deleteComment = async (req, res) => {
  const user = req.user;

  const { postId } = req.params;

  try {
    const post = await Posts.findById(postId);
    if (post) {
      const finded = post.comments.find(
        (comment) => comment.id === req.body.id
      );
      if (finded) {
        const filtered = post.comments.filter(
          (comment) => comment.id !== req.body.id
        );
        post.comments = filtered;
        await post.save();
      }
    } else {
      res.json({ status: "error", error: "Comment not found" });
    }
    res.json({ status: "success", data: post });
  } catch (error) {
    res.status(404).json({ status: "error", error: error.message });
  }
};

// update comments
module.exports.updateComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const error = validatePost(body);
    if (error.body)
      return res
        .status(404)
        .json({ status: "error", error: "comment body is empty" });
    const post = await Posts.findById(postId);
    if (post) {
      const finded = post.comments.find(
        (comment) => comment.id === req.body.id
      );
      finded.body = body;
      await post.save();
    } else {
      res.json({ error: "Comment not found" });
    }
    res.json({ status: "success", data: post });
  } catch (error) {}
};

// validate the body of post and comments
function validatePost(body) {
  const error = {};
  if (body.trim() === "") {
    error.body = "Body is empty";
  }
  return error;
}
