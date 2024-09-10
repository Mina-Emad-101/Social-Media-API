import { Router } from "express";
import { verifyJWT } from "../utils/middlewares.js";
import User from "../models/user.js";

const router = Router();

router.get("/api/users/friends", verifyJWT, async (req, res) => {
  const friends = req.user.friends;
  return res.json({ data: friends });
});

router.post("/api/users/friends/:id", verifyJWT, async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (!id) return res.sendStatus(400);

  if (user.id === id) return res.sendStatus(403);

  if (user.friends.includes(id)) return res.sendStatus(403);

  const friend = await User.findById(id);
  if (!friend) return res.sendStatus(404);

  user.friends.push(friend.id);
  await user.save().then(
    (_) => res.sendStatus(200),
    (err) => res.status(400).json({ error: err }),
  );
});

export default router;
