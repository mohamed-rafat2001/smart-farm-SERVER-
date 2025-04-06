import nodemailer from "nodemailer";
const sendEmail = async (Options) => {
	const transPorter = nodemailer.createTransport({
		service: "gmail",
		host: process.env.MAILER_HOST,
		port: process.env.MAILER_PORT,
		auth: {
			user: process.env.MAILER_ID,
			pass: process.env.MAILER_PASS,
		},
	});
	const mailOptions = {
		form: "SMART FARM",
		to: Options.email,
		subject: Options.subject,
		text: Options.message,
	};
	await transPorter.sendMail(mailOptions);
};
export default sendEmail;
