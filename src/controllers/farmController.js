import response from "../utils/handelRespone.js";
import catchAsync from "../middelwares/catchAsync.js";
import FarmModel from "../models/farm.js";
import appError from "../utils/appError.js";
import filterObject from "../utils/filterObject.js";
// create farm
export const createFarm = catchAsync(async (req, res, next) => {
	const { name, location } = req.body;
	const _id = req.user._id;
	const farm = await FarmModel.create({
		name,
		location,
		owner: _id,
	});

	if (!farm || !name) return next(new appError("farm not created", 400));

	response(res, 201, farm);
});

// get user farms
export const userFarms = catchAsync(async (req, res, next) => {
	const farms = await FarmModel.find({ owner: req.user._id });

	if (!farms) return next(new appError("no farms found", 404));

	response(res, 200, { farms, results: farms.length });
});
export const deletefarm = catchAsync(async (req, res, next) => {
	const farm = await FarmModel.findByIdAndUpdate(
		{ _id: req.body._id },
		{ active: false },
		{ new: true, runValidators: true }
	);

	if (!farm) return next(new appError("farm not deleted", 400));

	response(res, 200, null);
});

// update farm detales
export const updateFarm = catchAsync(async (req, res, next) => {
	const { _id } = req.body;
	const updates = filterObject(req.body, "name", "location");
	const farm = await FarmModel.findByIdAndUpdate(_id, updates, {
		new: true,
		runValidators: true,
	});

	if (!farm || !_id) return next(new appError("farm not updated", 400));

	response(res, 200, farm);
});
// get farm by id params
export const getFarm = catchAsync(async (req, res, next) => {
	const _id = req.params.id;
	const farm = await FarmModel.findById(_id);

	if (!farm || !_id) return next(new appError("farm not found", 404));

	response(res, 200, farm);
});

// get all users farms
export const usersFarms = catchAsync(async (req, res, next) => {
	const farms = await FarmModel.find();

	if (!farms) return next(new appError("farms not found", 404));

	response(res, 200, farms);
});
