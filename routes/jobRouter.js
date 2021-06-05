const router = require("express").Router();
const Job = require("../models/job.model");
const { sendEmail } = require("../services/mail");
const {ensureAuthenticated, ensureAdminAuth} = require("../services/checkers")

router.route("/myjob").get(ensureAuthenticated ,async(req,res) => {
	try{
		console.log(req.user);
		let jobs=await Job.find({branch:req.user.branch, year:req.user.year})
		console.log(jobs)
		res.json({
			jobs:jobs
		})
	}
	catch(e){
		res.json({error:e})
	}
});


router.route("/").get(ensureAdminAuth, async (req, res) => {
	try {
		let jobs=await Job.find()
		res.json({ success: "Jobs fetched successfully", jobs: jobs })
	} catch (error) {
		res.json({ failure: "Unable to fetch jobs", error: error })
	}
	// Job.find()
	// 	.then((jobs) => res.json({ success: "Jobs fetched successfully", jobs }))
	// 	.catch((err) => res.json({ failure: "Unable to fetch jobs", error: err }));
});






router.route("/add").post((req, res) => {
	const data = {
		companyName: req.body.companyName,
		description: req.body.description,
		documentLinks: req.body.documentLinks || [],
		gFormLink: req.body.gFormLink,
		contact: {
			email: req.body.email,
			phNo: Number(req.body.phNo),
			website: req.body.website,
			socLinks: {
				linkedIn: req.body.linkedIn,
				facebook: req.body.facebook,
				instagram: req.body.instagram,
				twitter: req.body.twitter,
			},
		},
		deadline: req.body.deadline,
		branch: req.body.branch,
		year: Number(req.body.year),
		timeline: [],
		status: true,
		reminderSent: false,
	};
	console.log(req.body.deadline);

	const newJob = new Job(data);

	newJob
		.save()
		.then(() => {
			sendEmail(newJob, false);
			res.json({ success: "Job added successfully" });
		})
		.catch((err) => res.json({ failure: "Unable to add job", error: err }));
});

router.route("/update/:id").put((req, res) => {
	Job.findById(req.params.id)
		.then((job) => {
			job.companyName = req.body.companyName;
			job.description = req.body.description;
			job.documentLinks = req.body.documentLinks || [];
			job.gFormLink = req.body.gFormLink;
			job.contact = {
				email: req.body.email,
				phNo: Number(req.body.phNo),
				website: req.body.website,
				socLinks: {
					linkedIn: req.body.linkedIn,
					facebook: req.body.facebook,
					instagram: req.body.instagram,
					twitter: req.body.twitter,
				},
			};
			job.deadline = Date(req.body.deadline);
			job.branch = req.body.branch;
			job.year = Number(req.body.year);
			job.timeline = [];
			job.status = Boolean(Number(req.body.status));

			job.save()
				.then(() => res.json({ success: "Job updated successfully" }))
				.catch((err) => res.json({ failure: "Unable to update job", error: err }));
		})
		.catch((err) => res.json({ failure: "Unable to find job", error: err }));
});

router.route("/delete/:id").delete((req, res) => {
	Job.deleteOne({ _id: id })
		.then(() => res.json({ success: "Job removed successfully" }))
		.catch((err) => res.json({ failure: "Unable to remove job", error: err }));
});

module.exports = router;
