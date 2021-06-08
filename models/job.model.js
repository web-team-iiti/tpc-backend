const { Schema, model } = require("mongoose");

const jobSchema = new Schema(
	{
		companyName: { type: String, required: true },
		description: { type: String, required: true },
		jobTitle: { type: String, required: true },
		documentLinks: {
			type: [
				{
					name: { type: String, required: true },
					link: { type: String, required: true },
				},
			],
			required: true,
			default: [],
		},
		gFormLink: { type: String, required: true },
		contact: {
			type: {
				email: { type: String, required: true, default: "" },
				phNo: { type: Number, required: true },
				website: { type: String, required: true, default: "" },
				socLinks: {
					type: {
						linkedIn: { type: String, default: "", required: true },
						facebook: { type: String, default: "", required: true },
						instagram: { type: String, default: "", required: true },
						twitter: { type: String, default: "", required: true },
					},
					required: true,
				},
			},
			required: true,
		},
		deadline: { type: String, required: true },
		branch: { type: [String], required: true, default: [] },
		year: { type: [String], required: true, default: [] },
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
		status: { type: String, default: "upcoming", required: true }, // status: upcoming || open || closed
		reminderSent: { type: Boolean, default: false, required: true }, // reminderSent ? "reminder mail has been sent" : "not sent"
	},
	{
		timestamps: true,
	}
);

const Job = model("Job", jobSchema);

module.exports = Job;
