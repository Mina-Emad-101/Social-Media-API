import { Router } from "express";
import Post from "../models/post.js";

const router = Router();

router.get("/api/posts", async (req, res) => {
	const posts = Post.find({ $or: [{ author_id: req.user.id }] });
});

export default router;
