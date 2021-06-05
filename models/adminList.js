const { Schema, model } = require("mongoose");

const adminListSchema = new Schema(
	{
		email: { type: String, required: true },
	},
);

const adminList = model("AdminList", adminListSchema);

module.exports = adminList;
