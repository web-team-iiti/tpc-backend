const router = require("express").Router();
const Student = require("../models/student.model");

const authService = require('../services/authService_student');
const passport = require("passport");
const { congoMail } = require("../services/mail");

router.route("/").get((req, res) => {
	Student.find()
		.then((students) => res.json({ success: "Students fetched successfully", students }))
		.catch((err) => res.json({ failure: "Unable to fetch students", error: err }));
});

router.route("/addOne").post((req, res) => {
	const data = {
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
	Student.insertMany(req.body.data)
		.then(() => res.json({ success: "Students added successfully" }))
		.catch((err) => res.json({ failure: "Unable to add students", error: err }));
});

router.route("/deleteAll").delete((req, res) => {
	Student.deleteMany()
		.then(() => res.json({ success: "All Students' data deleted successfully" }))
		.catch((err) => res.json({ failure: "Unable to delete all students' data", error: err }));
});

router.route("/addNotification/:id").post((req, res) => {
	Student.findById(req.params.id)
		.then((student) => {
			student.notifications = [req.body.post, ...student.notifications];
			student
				.save()
				.then(() => {
					congoMail(student.email, req.body.post);
					res.json({ success: "Notification added successfully" });
				})
				.catch((err) => res.json({ failure: "Unable to add notification", error: err }));
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
router.post('/login/student', authService.checkOAUTHtoken, passport.authenticate('custom', {
	failureRedirect: '/login/failure',
	session: false,
}), (req, res) => {
	authService.loginuser(req, res);
})
module.exports = router;
