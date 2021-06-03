const router = require("express").Router();

router.route("/").get((req, res) => {
	res.send("Student");
});

module.exports = router;
