import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
	author: {
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
});

const Post = model("Post", schema);

export default Post;
