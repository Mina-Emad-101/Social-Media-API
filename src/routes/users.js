import { Router } from "express";
import User from "../models/user.js";
import { verifyJWT } from "../utils/middlewares.js";

const router = Router();

router.get("/api/users", verifyJWT, async (req, res) => {
  const user = await User.findById(req.user.id);
  return res.json({ user: user });
});

router.post("/api/users", async (req, res) => {
  const { username, email, password } = req.body;

  const user = new User({
    username: username,
    email: email,
    password: password,
  });

  await user.save().catch((err) => {
    return res.json({ error: err });
  });

  return res.json(user);
});

export default router;
