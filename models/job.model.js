const { Schema, model } = require("mongoose");

const jobSchema = new Schema(
	{
		companyName: { type: String, required: true },
		description: { type: String, required: true },
		documentLinks: { type: [String], required: true, default: [] },
		gFormLink: { type: String, required: true },
		contact: {
			type: {
				email: { type: String, required: true, default: "" },
				phNo: { type: Number, required: true },
				website: { type: String, required: true, default: "" },
				socLinks: {
					type: {
						linkedIn: { type: String, default: "" },
						facebook: { type: String, default: "" },
						instagram: { type: String, default: "" },
						twitter: { type: String, default: "" },
					},
				},
			},
		},
		deadline: { type: Date, required: true },
		branch: { type: String, required: true, default: "" },
		year: { type: Number, required: true },
		timeline: {
			type: [
				{
					eventName: { type: String, required: true, default: "" },
					eventDate: { type: Date, required: true },
				},
			],
			default: [],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Job = model("Job", jobSchema);

module.exports = Job;
