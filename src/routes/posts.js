import { Router } from "express";
import Post from "../models/post.js";
import { validateAuthorID, verifyJWT } from "../utils/middlewares.js";
import { checkSchema } from "express-validator";
import { createSchema, putSchema } from "../validationSchemas/posts.js";

const router = Router();

router.get("/api/posts", verifyJWT, async (req, res) => {
  const posts = await Post.find({
    $or: [{ author_id: req.user.id }, { author_id: { $in: req.user.friends } }],
  }).sort({ created_at: -1 });

  return res.json({ data: posts });
});

router.get("/api/posts/:id", verifyJWT, validateAuthorID, (req, res) => {
  return res.json(req.post);
});

router.post(
  "/api/posts",
  verifyJWT,
  checkSchema(createSchema),
  async (req, res) => {
    const { text, attachment } = req.body;

    const post = new Post({
      author_id: req.user.id,
      text: text,
      attachment: attachment,
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
  async (req, res) => {
    const { text, attachment } = req.body;

    const post = req.post;

    post.text = text;
    post.attachment = attachment;

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
