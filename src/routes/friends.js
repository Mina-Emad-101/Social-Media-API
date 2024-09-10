import { Router } from "express";
import { verifyJWT } from "../utils/middlewares.js";
import User from "../models/user.js";

const router = Router();

router.get("/api/users/friends", verifyJWT, async (req, res) => {
	const friends = req.user.friends;
	return res.json({ data: friends });
});

router.post("/api/users/friends/:id", verifyJWT, async (req, res) => {
	const id = req.params.id;
	if (!id) return res.sendStatus(400);

	const friend = User.findById(id);
	if (!friend) return res.sendStatus(404);

	req.user.friends.push(friend.id);
	return res.sendStatus(200);
});

export default router;
