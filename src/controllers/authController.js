import UserModel from "../models/user.js";

import response from "../utils/handelRespone.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";
import catchAsync from "../middelwares/catchAsync.js";
//create new User
export const signUp = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
		req.body;
	const user = await UserModel.create({
		firstName,
		lastName,
		email,
		password,
		confirmPassword,
		phoneNumber,
	});

	const token = user.createJwt();

	response(res, 201, { user, token });
});

// login user
export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// check if email and password exist
	if (!email || !password) return res.send("please provide email and password");
	// check if user is exist and password is correct
	const user = await UserModel.findOne({ email }).select("+password");

	if (!user || !user.isCorrectPass(password, user.password))
		return res.send("email or password is wrong");

	const token = user.createJwt();

	response(res, 200, { token });
});
// forgot password using email
export const forgotPassord = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	// find the user by email
	const user = await UserModel.findOne({ email });
	if (!user) return res.send("user not found");
	// create random token
	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/user/resetPassword/${resetToken}`;
	await sendEmail({
		email: user.email,
		subject: "FORGOT PASSWORD (valid for 10 min)",
		message: `continue with this link if forgot password >>\n ${resetUrl}`,
	});
	response(res, 200, {});
});
// reset password
export const resetPassword = catchAsync(async (req, res, next) => {
	// get user based on the token.

	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");
	const user = await UserModel.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});
	// check if user or not
	if (!user) return res.send("token is invalid or has expired");

	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	const token = user.createJwt();

	response(res, 200, { user, token });
});
// update password
export const updatePassword = catchAsync(async (req, res, next) => {
	const { newPassword, confirmNewPassword, password } = req.body;
	const user = await UserModel.findById(req.user._id).select("+password");
	const correctPass = await user.isCorrectPass(password, user.password);

	if (!correctPass) return res.send("pass is wrong");

	user.password = newPassword;
	user.confirmPassword = confirmNewPassword;

	await user.save();
	const token = user.createJwt();
	response(res, 201, { user, token });
});
