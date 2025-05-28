import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "first name is required"],
			trim: true,
			minlength: 2,
		},
		lastName: {
			type: String,
			required: [true, "last name is required"],
			trim: true,
			minlength: 2,
		},
		email: {
			type: String,
			required: [true, "email is required"],
			trim: true,
			unique: true,
			validate: [validator.isEmail, "please enter the valid email"],
		},
		phoneNumber: String,

		password: {
			type: String,
			required: [true, "password is required"],
			trim: true,
			validate: [
				validator.isStrongPassword,
				"please enter the strong password",
			],
			select: false,
		},
		confirmPassword: {
			type: String,
			required: [true, "confirm password is required"],
			trim: true,
			validate: {
				validator: function (el) {
					return el === this.password;
				},
				message: "passwords are not the same",
			},
		},
		profileImg: {
			public_id: String,
			secure_url: String,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin", "tecSupport"],
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
	{ timestamps: true }
);
userSchema.virtual("farms", {
	ref: "FarmModel",
	foreignField: "owner",
	localField: "_id",
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);

	this.confirmPassword = undefined;
	next();
});
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});
// create jwt
userSchema.methods.createJwt = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTKEY, {
		expiresIn: process.env.JWTEXPIRE,
	});
	return token;
};
// compare password to login
userSchema.methods.isCorrectPass = async (password, userPassword) => {
	const hash = await bcrypt.compare(password, userPassword);
	return hash;
};
// create password reset token
userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

export default mongoose.model("UserModel", userSchema);
