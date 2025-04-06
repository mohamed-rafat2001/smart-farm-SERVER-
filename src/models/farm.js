import mongoose from "mongoose";
const farmSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			minlength: 3,
		},
		owner: {
			type: mongoose.Schema.ObjectId,
			ref: "UserModel",
		},
		location: {
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			coordinates: [Number],
			address: String,
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},

	{ timestamps: true }
);
farmSchema.pre(/^find/, function (next) {
	this.populate({
		path: "owner",
		select: "profileImg firstName lastName",
	});
	this.find({ active: { $ne: false } });
	next();
});
export default mongoose.model("FarmModel", farmSchema);
