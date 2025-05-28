import UserModel from "../models/user.js";
import appError from "../utils/appError.js";
import response from "../utils/handelRespone.js";
import sendCookie from "../utils/sendCookie.js";
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
	if (!user) return next(appError("user not signUp", 400));
	const token = user.createJwt();
	user.password = undefined;
	sendCookie(res, token);
	response(res, 201, { user, token });
});

// login user
export const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// check if email and password exist
	if (!email || !password)
		return next(appError("please provide email and password", 400));
	// check if user is exist and password is correct
	const user = await UserModel.findOne({ email }).select("+password");

	if (!user || !(await user.isCorrectPass(password, user.password)))
		return next(new appError("email or password is wrong", 400));

	const token = user.createJwt();

	sendCookie(res, token);
	response(res, 200, { token, user });
});
// logout user
export const logOut = catchAsync(async (req, res, next) => {
	sendCookie(res, "");
	response(res, 200, {});
});
// forgot password using email
export const forgotPassord = catchAsync(async (req, res, next) => {
	const { email } = req.body;
	// find the user by email
	const user = await UserModel.findOne({ email });
	if (!user) return next(appError("user not found", 404));
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
	if (!user) return next(appError("token is invalid or has expired", 400));

	user.password = req.body.password;
	user.confirmPassword = req.body.confirmPassword;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	const token = user.createJwt();

	sendCookie(res, token);
	response(res, 200, { user, token });
});
// update password
export const updatePassword = catchAsync(async (req, res, next) => {
	const { newPassword, confirmNewPassword, password } = req.body;
	const user = await UserModel.findById(req.user._id).select("+password");
	const correctPass = await user.isCorrectPass(password, user.password);

	if (!correctPass) return next(new appError("password is incorrect", 400));

	user.password = newPassword;
	user.confirmPassword = confirmNewPassword;
	const token = user.createJwt();
	await user.save();

	response(res, 201, { user, token });
});
