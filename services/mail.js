const nodemailer = require("nodemailer");
require("dotenv").config();

function sendEmail(userEmail, subject, html) {
	var transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_AUTH_USER,
			pass: process.env.MAIL_AUTH_PASS,
		},
	});

	var mailOptions = {
		from: "no-reply-tpc@iiti.ac.in",
		to: userEmail,
		subject: subject,
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

module.exports = sendEmail;
