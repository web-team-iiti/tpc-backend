const nodemailer = require("nodemailer");
const schedule = require("node-schedule");
const Job = require("../models/job.model");
require("dotenv").config();

// run every 10mins
schedule.scheduleJob("*/10 * * * *", () => {
	Job.find()
		.then((jobs) => {
			var i = 0;
			// console.log("Hi");
			while (jobs[i]) {
				var d = new Date();
				var e = new Date(jobs[i].deadline);

				// Check if deadline is within 2hrs and reminder mail has not been sent yet
				if (e - d <= 7200000 && !jobs[i].reminderSent) {
					jobs[i].reminderSent = true;
					jobs[i]
						.save()
						.then((job) => sendEmail(job, true))
						.catch((err) => console.log(err));
				}
				i++;
			}
		})
		.catch((err) => console.log({ failure: "Unable to fetch jobs (schedulejob)", error: err }));
});

function notificationMail(branch, year, subject, post) {
	var transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_AUTH_USER,
			pass: process.env.MAIL_AUTH_PASS,
		},
	});

	var to = "";
	var i = 0;
	var j = 0;

	while (branch[i]) {
		while (year[j]) {
			to += year[j] + "btech-" + branch[i] + "@iiti.ac.in, ";
			j++;
		}
		i++;
	}

	to = to.slice(0, -2);

	var mailOptions = {
		from: "no-reply-tpc@iiti.ac.in",
		to: to,
		subject: subject,
		html: "<p>" + post + "</p>",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

function notificationArrayEmail(users, subject, text) {
	var transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_AUTH_USER,
			pass: process.env.MAIL_AUTH_PASS,
		},
	});

	to = "";

	var i = 0;

	while (users[i]) {
		to += users[i] + ", ";
		i++;
	}

	to.slice(0, -2);

	var mailOptions = {
		from: "no-reply-tpc@iiti.ac.in",
		to: to,
		subject: subject,
		html: "<p>" + text + "</p>",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

function sendEmail(job, reminder) {
	var transporter = nodemailer.createTransport({
		host: process.env.MAIL_HOST,
		port: process.env.MAIL_PORT,
		auth: {
			user: process.env.MAIL_AUTH_USER,
			pass: process.env.MAIL_AUTH_PASS,
		},
	});

	var to = "";
	var i = 0;
	while (job.branch[i]) {
		to += job.year + "btech-" + job.branch[i] + "@iiti.ac.in, ";
		i++;
	}
	to = to.slice(0, -2);

	var mailOptions = {
		from: "no-reply-tpc@iiti.ac.in",
		to: to,
		subject: job.companyName,
		html: "<p>" + (reminder ? "Reminder" : job.description) + "</p>",
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

module.exports = { sendEmail, notificationArrayEmail, notificationMail };
