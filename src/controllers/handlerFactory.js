import appError from "../utils/appError.js";
import catchAsync from "../middelwares/catchAsync.js";
import response from "../utils/handelRespone.js";
import filterObject from "../utils/filterObject.js";

// delete doc
export const deleteByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findOneAndUpdate(
			{ _id: req.params.id, owner: req.user._id },
			{ active: false },
			{ new: true, runValidators: true }
		);

		if (!doc) return next(new appError("doc not deleted", 400));

		response(res, 200, null);
	});

// get doc by params
export const getByParams = (Model) =>
	catchAsync(async (req, res, next) => {
		const _id = req.params.id;
		const doc = await Model.findById(_id);

		if (!doc || !_id) return next(new appError("doc not found", 404));

		response(res, 200, doc);
	});

//get all docs
export const getAllDocs = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.find();

		if (!docs) return next(new appError("docs not found", 404));

		response(res, 200, { docs, results: docs.length });
	});

// get doc by owner
export const getByOwner = (Model) =>
	catchAsync(async (req, res, next) => {
		const docs = await Model.find({ owner: req.user._id });

		if (!docs) return next(new appError("no docs found", 404));

		response(res, 200, { docs, results: docs.length });
	});

// create doc By Owner
export const CreateByOwner = (Model, ...fields) =>
	catchAsync(async (req, res, next) => {
		const filter = filterObject(req.body, ...fields);
		const _id = req.user._id;
		const doc = await Model.create({
			...filter,
			owner: _id,
		});

		if (!doc) return next(new appError("doc not created", 400));

		response(res, 201, doc);
	});

// update by owner
export const updateByOwner = (Model, ...fields) =>
	catchAsync(async (req, res, next) => {
		const _id = req.params.id;
		const filter = filterObject(req.body, ...fields);
		const doc = await Model.findOneAndUpdate(
			{ _id, owner: req.user._id },
			filter,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!doc || !_id) return next(new appError("doc not updated", 400));

		response(res, 200, doc);
	});
