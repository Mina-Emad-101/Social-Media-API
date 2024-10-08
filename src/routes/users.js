import { Router } from "express";
import User from "../models/user.js";
import { verifyJWT } from "../utils/middlewares.js";
import { checkSchema, validationResult } from "express-validator";
import {
  createSchema,
  patchSchema,
  putSchema,
} from "../validationSchemas/users.js";

const router = Router();

router.get("/api/users", verifyJWT, async (req, res) => {
  const user = await User.findById(req.user.id);
  return res.json(user);
});

router.post("/api/users", checkSchema(createSchema), async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ validation_errors: result.array() });

  const { username, email, password } = req.body;

  const user = new User({
    username: username,
    email: email,
    password: password,
  });

  await user.save().then(
    (_) => res.json({ id: user.id }),
    (err) => res.status(400).json({ error: err }),
  );
});

router.put(
  "/api/users",
  checkSchema(putSchema),
  verifyJWT,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({ validationError: result.array() });

    const { username, email, password } = req.body;

    await User.updateOne(
      { id: req.user.id },
      {
        username: username,
        email: email,
        password: password,
      },
    );

    return res.sendStatus(200);
  },
);

router.patch(
  "/api/users",
  checkSchema(patchSchema),
  verifyJWT,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.json({ validationError: result.array() });

    const { username, email, password } = req.body;

    const user = await User.findById(req.user.id);

    user.username = username ?? user.username;
    user.email = email ?? user.email;
    user.password = password ?? user.password;

    await user.save();

    return res.sendStatus(200);
  },
);

router.delete("/api/users", verifyJWT, async (req, res) => {
  const user = User.findById(req.user.id);
  await user.deleteOne();
  return res.json(user);
});

export default router;
