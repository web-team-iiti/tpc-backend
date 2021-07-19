const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		branch: { type: String, required: true },
		year: { type: Number, required: true, default: 1 },
		notifications: {
			type: [
				{
					text: { type: String, default: "" },
					subject: { type: String, default: "" },
					companyName: { type: String, default: "" },
					date: { type: Date, default: Date.now },
				},
			],
			required: true,
			default: [],
		},
		schema_version: { type: Number, default: 2 },
	},
	{
		timestamps: true,
	}
);

const Student = model("Student", studentSchema);

module.exports = Student;
