const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
});

module.exports = model("post", postSchema);
