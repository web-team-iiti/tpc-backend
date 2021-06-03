const nodemailer = require("nodemailer");

function sendEmail() {
	var transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "692f6bd56d6eeb",
			pass: "b53ffc595c33cc",
		},
	});

	var mailOptions = {
		from: "no-reply@iiti.ac.in",
		to: "cse190001031@iiti.ac.in",
		subject: "Reset Password",
		html: '<p>Click the link given below to reset your password</p><a href="localhost:3000/admin_reset_password/?s=">Click here</a>',
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
