const router = require("express").Router();
const Student = require("../models/student.model");

const authService = require("../services/authService_student");
const passport = require("passport");
const { notificationArrayEmail, notificationMail } = require("../services/mail");
const { ensureAdmin } = require("../services/checkers");

router.post(
	"/login",
	authService.checkOAUTHtoken,
	passport.authenticate("custom", {
		failureRedirect: "/login/failure",
		session: false,
	}),
	(req, res) => {
		console.log("login called", req.user);
		authService.loginuser(req, res);
	}
);

router.use(ensureAdmin);

router.route("/").get((req, res) => {
	Student.find()
		.then((students) => {
			res.json({ success: "Students fetched successfully", students: students });
		})
		.catch((err) => res.json({ failure: "Unable to fetch students", error: err }));
});

router.route("/addOne").post((req, res) => {
	const data = {
		name: req.body.name,
		email: req.body.email,
		branch: req.body.branch,
		year: Number(req.body.year),
	};

	const newStudent = new Student(data);

	newStudent
		.save()
		.then(() => res.json({ success: "Student added successfully" }))
		.catch((err) => res.json({ failure: "Unable to add student", error: err }));
});

router.route("/addMany").post((req, res) => {
	console.log(req.body);
	Student.insertMany(req.body)
		.then(() => res.json({ success: "Students added successfully" }))
		.catch((err) => res.json({ failure: "Unable to add students", error: err }));
});

router.route("/deleteAll").delete((req, res) => {
	Student.deleteMany()
		.then(() => res.json({ success: "All Students' data deleted successfully" }))
		.catch((err) => res.json({ failure: "Unable to delete all students' data", error: err }));
});

router.route("/addNotificationArray").post((req, res) => {
	console.log(req.body);
	Student.updateMany({ email: req.body.emails }, { $push: { notifications: { text: req.body.text } } })
		.then(() => {
			notificationArrayEmail(req.body.emails, req.body.subject, req.body.text);
			res.json("Hi");
		})
		.catch((err) => res.json({ failure: "Unable to find student", error: err }));
});

router.route("/addNotificationBranch").post((req, res) => {
	console.log(req.body);
	Student.updateMany(
		{ branch: req.body.branch, year: req.body.year },
		{ $push: { notifications: { text: req.body.message } } }
	)
		.then(() => {
			// console.log(students);
			notificationMail(req.body.branch, req.body.year,req.body.subject, req.body.message);
			res.json("Hi");
		})
		.catch((err) => res.json({ failure: "Unable to find student", error: err }));
});

router.route("/update/:id").put((req, res) => {
	Student.findById(req.params.id)
		.then((student) => {
			student.email = req.body.email;
			student.branch = req.body.branch;
			student.year = Number(req.body.year);
			student
				.save()
				.then(() => res.json({ success: "Student updated successfully" }))
				.catch((err) => res.json({ failure: "Unable to update student", error: err }));
		})
		.catch((err) => res.json({ failure: "Unable to find student", error: err }));
});

router.route("/delete/:id").delete((req, res) => {
	Student.deleteOne({ _id: id })
		.then(() => res.json({ success: "Student removed successfully" }))
		.catch((err) => res.json({ failure: "Unable to remove student", error: err }));
});

router.post(
	"/google",
	passport.authenticate("google-token", { failureRedirect: "google/failure", session: false }),
	(req, res) => {
		authService.loginuser(req, res);
	}
);

router.get("/google/failure", (req, res) => {
	res.status(401).json({ message: "failed" });
});

module.exports = router;
