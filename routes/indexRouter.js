const sendEmail = require("../services/mail");

const router = require("express").Router();

router.route("/").get((req, res) => {
	res.send("Hello World");
});

router.route("/sendMail").get((req, res) => {
	sendEmail("cse190001031@iiti.ac.in", "Testing", "<h1>Hello World</h1>");
});

module.exports = router;
