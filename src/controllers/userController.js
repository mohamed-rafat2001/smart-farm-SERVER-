import catchAsync from "../middelwares/catchAsync.js";
import UserModel from "../models/user.js";
import response from "../utils/handelRespone.js";
import filterObject from "../utils/filterObject.js";
import { getByParams, getAllDocs } from "./handlerFactory.js";
import appError from "../utils/appError.js";

// get all users ij system
export const getAllUsers = getAllDocs(UserModel);

//get user by id
export const getUserById = catchAsync(async (req, res, next) => {
	const { _id } = req.body;
	const user = await UserModel.findById(_id);

	if (!user || !_id) return next(new appError("user not found", 404));

	response(res, 200, user);
});
//get user by params
export const getUserByParams = getByParams(UserModel);

// get user profile
export const getMe = catchAsync(async (req, res, next) => {
	const user = await UserModel.findById(req.user._id).populate({
		path: "farms",
		select: "-location -owner -__v",
	});
	if (!user) return next(new appError("user not found", 404));
	response(res, 200, user);
});

// update ME

export const updateMe = catchAsync(async (req, res, next) => {
	// don't allow to update password from this route
	if (req.body.password || req.body.confirmPassword)
		return res.send("this route not using to update password");

	// determine the updates field
	const filter = filterObject(
		req.body,
		"firstName",
		"lastName",
		"email",
		"phoneNumber"
	);

	// update me
	const user = await UserModel.findByIdAndUpdate(req.user._id, filter, {
		new: true,
		runValidators: true,
	});
	if (!user) return next(new appError("user not updated", 400));
	response(res, 200, user);
});

// delete Me
export const deleteMe = catchAsync(async (req, res, next) => {
	// find user and change active true to false
	const doc = await Model.findByIdAndUpdate(
		req.user._id,
		{
			active: false,
		},
		{ new: true, runValidators: true }
	);
	if (!doc) return next(new appError("doc not deleted", 400));

	response(res, 200, null);
});
