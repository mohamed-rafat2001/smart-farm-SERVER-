import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import catchAsync from "./catchAsync.js";

// authentication
export const protect = catchAsync(async (req, res, next) => {
	let token;
	// get token from headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	if (!token) return res.send("no token");
	// verification token

	const decode = await jwt.verify(token, process.env.JWTKEY);

	// check if user still exist
	const user = await userModel.findById(decode._id);
	if (!user) return res.send("the user belong to this token does'nt exist");

	req.user = user;

	next();
});

// authorization and permissions
export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.send("you don't have permission to perform this action");
		}
		next();
	};
};
