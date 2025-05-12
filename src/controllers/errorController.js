import appError from "../utils/appError.js";
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({
			status: "error",
			message: "something went very wrong",
		});
	}
};
const handelCastErrorDB = (err) => {
	const message = `Invalid ${err.path} : ${err.value}`;
	return new appError(message, 400);
};
const handelDuplicatErrordDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate feild value : ${value} please use another value!`;

	return new appError(message, 400);
};
const handelValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `invalid input data. ${errors.join(". ")}`;
	return new appError(message, 400);
};
export default function globalErrorHandler(err, req, res, next) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";
	if (process.env.MODE === "DEV") {
		sendErrorDev(err, res);
	} else if (process.env.MODE === "PRODUCTION") {
		let error = err;
		if (error.name === "CastError")
			error = handelCastErrorDB(error.errorResponse);
		if (error.code === 11000)
			error = handelDuplicatErrordDB(error.errorResponse);
		if (error.name === "ValidationError")
			error = handelValidationErrorDB(error);

		sendErrorProd(error, res);
	}
}
