const router = require("express").Router();

router.route("/").get((req, res) => {
	res.send("Hi");
});

module.exports = router;
