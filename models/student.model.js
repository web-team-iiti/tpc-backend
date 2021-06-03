const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
	{
		email: { type: String, required: true },
		branch: { type: String, required: true },
		year: { type: Number, required: true, default: 1 },
		notifications: { type: [{ text: { type: String, default: "", required: true } }], required: true, default: [] },
	},
	{
		timestamps: true,
	}
);

const Student = model("Student", studentSchema);

module.exports = Student;
