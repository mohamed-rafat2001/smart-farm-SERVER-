export default function (res, code, data) {
	res.status(code).json({
		status: "success",
		data,
	});
}
