import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import catchAsync from "./catchAsync.js";
import appError from "../utils/appError.js";

// authentication
export const protect = catchAsync(async (req, res, next) => {
	let token;
	// get token from headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.token) token = req.cookies.token;
	if (!token) return next(new appError("no token", 400));
	// verification token

	const decode = jwt.verify(token, process.env.JWTKEY);

	// check if user still exist
	const user = await userModel.findById(decode._id);
	if (!user) return next("the user belong to this token does'nt exist", 404);

	req.user = user;

	next();
});

// authorization and permissions
export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new appError("you don't have permission to perform this action", 400)
			);
		}
		next();
	};
};
