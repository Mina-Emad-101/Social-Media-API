import { Router } from "express";
import Post from "../models/post.js";
import { validateAuthorID, verifyJWT } from "../utils/middlewares.js";
import { checkSchema } from "express-validator";
import { createSchema, putSchema } from "../validationSchemas/posts.js";
import upload from "../utils/storage.js";

const router = Router();

router.get("/api/posts", verifyJWT, async (req, res) => {
  const posts = await Post.find({
    $or: [{ author_id: req.user.id }, { author_id: { $in: req.user.friends } }],
  }).sort({ created_at: -1 });

  posts.map((post) => {
    post.attachment = post.attachment ? true : false;
  });

  return res.json({ data: posts });
});

router.get("/api/posts/:id", verifyJWT, validateAuthorID, (req, res) => {
  req.post.attachment = req.post.attachment ? true : false;

  return res.json(req.post);
});

router.get(
  "/api/posts/:id/attachment",
  verifyJWT,
  validateAuthorID,
  (req, res) => {
    return res.sendFile(req.post.attachment);
  },
);

router.post(
  "/api/posts",
  verifyJWT,
  checkSchema(createSchema),
  upload.single("attachment"),
  async (req, res) => {
    const { text } = req.body;

    const post = new Post({
      author_id: req.user.id,
      text: text,
      attachment: req.file.path,
      likes: 0,
    });

    await post.save().then(
      (_) => res.json(post),
      (err) => res.status(500).json({ error: err }),
    );
  },
);

router.put(
  "/api/posts/:id",
  verifyJWT,
  validateAuthorID,
  checkSchema(putSchema),
  upload.single("attachment"),
  async (req, res) => {
    const { text } = req.body;

    const post = req.post;

    post.text = text;
    post.attachment = req.file.path;

    await post.save().then(
      (_) => res.sendStatus(200),
      (err) => res.status(400).json({ error: err }),
    );
  },
);

router.delete(
  "/api/posts/:id",
  verifyJWT,
  validateAuthorID,
  async (req, res) => {
    const post = req.post;
    await post.deleteOne().then(
      (_) => res.json(post),
      (err) => res.status(400).json({ error: err }),
    );
  },
);

export default router;
