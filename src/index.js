import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import friendsRouter from "./routes/friends.js";
import postsRouter from "./routes/posts.js";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

mongoose
	.connect("mongodb://127.0.0.1:27017/social")
	.then(() => console.log("Connected to MongoDB"));

// Middlewares
app.use(express.json());

// Routes
app.use(authRouter);
app.use(usersRouter);
app.use(friendsRouter);
app.use(postsRouter);

app.listen(PORT, HOST, () => {
	console.log(`Listening on ${HOST}:${PORT}`);
});
