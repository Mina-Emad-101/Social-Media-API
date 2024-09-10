import jwt from "jsonwebtoken";
import User from "../models/user.js";

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
