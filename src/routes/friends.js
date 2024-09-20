import { Router } from "express";
import { verifyJWT } from "../utils/middlewares.js";
import User from "../models/user.js";

const router = Router();

router.get("/api/friends", verifyJWT, async (req, res) => {
  const friends = req.user.friends;
  return res.json({ data: friends });
});

router.get("/api/friend-requests", verifyJWT, (req, res) => {
  return res.json({ data: req.user.friend_requests });
});

router.post("/api/friend-requests/:id", verifyJWT, async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (!id) return res.sendStatus(400);

  if (user.id === id) return res.sendStatus(403);

  if (user.friends.includes(id)) return res.sendStatus(403);

  const friend = await User.findById(id).catch((err) => console.log(err));
  if (!friend) return res.sendStatus(404);

  if (
    friend.friend_requests
      .map((request) => request.toString())
      .includes(user.id)
  )
    return res.sendStatus(403);

  friend.friend_requests.push(user.id);
  await friend.save().then(
    (_) => res.sendStatus(200),
    (err) => res.status(400).json({ error: err }),
  );
});

router.post("/api/accept-friend-requests/:id", verifyJWT, async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (!user.friend_requests.map((req_id) => req_id.toString()).includes(id))
    return res.sendStatus(404);

  user.friend_requests = user.friend_requests.filter(
    (req_id) => req_id.toString() !== id,
  );
  user.friends.push(id);

  const friend = await User.findById(id);

  friend.friends.push(user.id);

  await friend.save().catch((err) => console.log(err));
  await user.save().then(
    (_) => res.sendStatus(200),
    (err) => res.status(500).json({ error: err }),
  );
});

export default router;
