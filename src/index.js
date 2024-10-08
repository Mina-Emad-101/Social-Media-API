import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import friendsRouter from "./routes/friends.js";
import postsRouter from "./routes/posts.js";
import cors from "cors";
import path from "path";

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const app = express();

mongoose
	.connect(
		`mongodb+srv://mina:${process.env.DBPASSWORD}@cluster0.yjr3f.mongodb.net/social?retryWrites=true&w=majority&appName=Cluster0`,
	)
	.then(() => console.log("Connected to MongoDB"));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(cors());

// Routes
app.use(authRouter);
app.use(usersRouter);
app.use(friendsRouter);
app.use(postsRouter);

app.listen(PORT, HOST, () => {
	console.log(`Listening on ${HOST}:${PORT}`);
});
