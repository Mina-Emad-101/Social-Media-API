import { Router } from "express";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import {
  getCommentFromID,
  getPostFromID,
  validateAuthorID,
  verifyJWT,
} from "../utils/middlewares.js";
import { checkSchema } from "express-validator";
import { createSchema, putSchema } from "../validationSchemas/posts.js";
import upload from "../utils/storage.js";
import { createCommentSchema } from "../validationSchemas/comments.js";
import Notification from "../models/notification.js";
import { sendNotification } from "../utils/functions.js";

const router = Router();

router.get("/api/posts", verifyJWT, async (req, res) => {
  let posts = await Post.find({
    $or: [{ author_id: req.user.id }, { author_id: { $in: req.user.friends } }],
  }).sort({ created_at: -1 });

  posts = posts.map((post) => {
    post = post.toJSON();
    post.liked_by_user = post.likes
      .map((like) => like.toString())
      .includes(req.user.id);
    return post;
  });

  return res.json({ data: posts });
});

router.get(
  "/api/posts/:id",
  verifyJWT,
  getPostFromID,
  validateAuthorID,
  (req, res) => {
    const post = req.post.toJSON();

    post.liked_by_user = post.likes
      .map((like) => like.toString())
      .includes(req.user.id);

    return res.json(post);
  },
);

router.get(
  "/api/comments/:comment_id",
  verifyJWT,
  getCommentFromID,
  async (req, res) => {
    const comment = req.comment.toJSON();

    comment.liked_by_user = comment.likes
      .map((like) => like.toString())
      .includes(req.user.id);

    return res.json(comment);
  },
);

router.get("/api/notifications", verifyJWT, async (req, res) => {
  const notifications = await Notification.find({ to: req.user.id });

  return res.json({ data: notifications });
});

router.post(
  "/api/posts",
  verifyJWT,
  checkSchema(createSchema),
  upload.array("attachment"),
  async (req, res) => {
    const { text } = req.body;

    const post = new Post({
      author_id: req.user.id,
      text: text,
      attachments: req.files.map((file) => `/attachments/${file.filename}`),
    });

    await post.save().then(
      async (_) => {
        await Promise.all(
          req.user.friends.map(async (friend_id) => {
            await sendNotification(
              req.user.id,
              req.user.username,
              friend_id,
              "new_post",
            );
          }),
        );
        res.json({ id: post.id });
      },
      (err) => res.status(500).json({ error: err }),
    );
  },
);

router.post(
  "/api/posts/:id/like",
  verifyJWT,
  getPostFromID,
  async (req, res) => {
    const post = req.post;

    if (post.likes.includes(req.user.id))
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    else post.likes.push(req.user.id);

    await post.save().then(
      async (post) => {
        await sendNotification(
          req.user.id,
          req.user.username,
          post.author_id,
          "like_post",
        );
        return res.sendStatus(200);
      },
      (err) => res.status(500).json({ error: err }),
    );
  },
);

router.post(
  "/api/posts/:id/comments",
  verifyJWT,
  getPostFromID,
  checkSchema(createCommentSchema),
  async (req, res) => {
    const { text } = req.body;
    const post = req.post;

    const comment = new Comment({
      post_id: post.id,
      commenter_id: req.user.id,
      text: text,
    });

    post.comments.push(comment.id);

    await comment.save().then(
      async (comment) => {
        await post.save().catch((err) => res.status(500).json({ error: err }));

        await sendNotification(
          req.user.id,
          req.user.username,
          post.author_id,
          "comment",
        );

        return res.json({ id: comment.id });
      },
      (err) => res.status(500).json({ error: err }),
    );
  },
);

router.post(
  "/api/comments/:comment_id/like",
  verifyJWT,
  getCommentFromID,
  async (req, res) => {
    const comment = req.comment;

    if (comment.likes.includes(req.user.id))
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== req.user.id,
      );
    else comment.likes.push(req.user.id);

    await comment.save().then(
      async (comment) => {
        await sendNotification(
          req.user.id,
          req.user.username,
          comment.commenter_id,
          "like_comment",
        );

        return res.sendStatus(200);
      },
      (err) => res.status(500).json({ error: err }),
    );
  },
);

router.put(
  "/api/posts/:id",
  verifyJWT,
  getPostFromID,
  validateAuthorID,
  checkSchema(putSchema),
  upload.array("attachment"),
  async (req, res) => {
    const { text } = req.body;

    const post = req.post;

    post.text = text;
    post.attachment = req.files.map((file) => `/attachments/${file.filename}`);

    await post.save().then(
      (_) => res.sendStatus(200),
      (err) => res.status(400).json({ error: err }),
    );
  },
);

router.delete(
  "/api/posts/:id",
  verifyJWT,
  getPostFromID,
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
