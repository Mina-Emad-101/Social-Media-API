import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";

export const verifyJWT = (req, res, next) => {
  const auth_header = req.headers["authorization"];
  let token = null;
  try {
    token = auth_header.split(" ")[1];
  } catch (err) {
    return res.json({ error: "Authorization header must contain Token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.sendStatus(401);

    const loggedInUser = await User.findById(user.id);
    req.user = loggedInUser;

    return next();
  });
};

export const getPostFromID = async (req, res, next) => {
  const id = req.params.id;

  const post = await Post.findById(id).catch((err) => console.log(err));
  if (!post) return res.sendStatus(404);

  req.post = post;

  return next();
};

export const getCommentFromID = async (req, res, next) => {
  const id = req.params.comment_id;

  const comment = await Comment.findById(id).catch((err) => console.log(err));
  if (!comment) return res.sendStatus(404);

  const post = await Post.findById(comment.post_id).catch((err) =>
    console.log(err),
  );

  if (
    req.user.id !== post.author_id.toString() &&
    !req.user.friends.includes(post.author_id.toString())
  )
    return res.sendStatus(403);

  req.comment = comment;

  return next();
};

export const validateAuthorID = async (req, res, next) => {
  if (
    req.user.id !== req.post.author_id.toString() &&
    !req.user.friends.includes(req.post.author_id.toString())
  )
    return res.sendStatus(403);

  return next();
};
