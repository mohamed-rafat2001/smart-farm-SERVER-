function sendCookie(res, token) {
	const cookieOptions = {
		expires: new Date(
			Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.MODE === "PRODUCTION") cookieOptions.secure = true;

	res.cookie("token", token, cookieOptions);
}
export default sendCookie;
