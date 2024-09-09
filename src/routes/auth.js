import { Router } from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.js";

const router = Router();

router.post("/api/auth", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) return res.sendStatus(404);

  if (user.password !== password) return res.sendStatus(401);

  const access_token = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    },
  );
  const refresh_token = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
  );

  await new RefreshToken({ value: refresh_token }).save();

  return res.json({ access_token: access_token, refresh_token: refresh_token });
});

router.delete("/api/auth", async (req, res) => {
  //
});

router.post("/api/refresh", async (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) return res.sendStatus(401);

  const db_token = await RefreshToken.findOne({ value: refresh_token });
  if (!db_token) return res.sendStatus(401);

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);

    const access_token = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      },
    );

    return res.json({ access_token: access_token });
  });
});

export default router;
