import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    attachment: {
      type: String,
    },
    likes: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const Post = model("Post", schema);

export default Post;
