import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  author_id: {
    type: Number,
    required: true,
  },
  content: {
    text: String,
    attachment_path: String,
  },
  likes: {
    type: Number,
    required: true,
  },
});

const Post = model("Post", schema);

export default Post;
