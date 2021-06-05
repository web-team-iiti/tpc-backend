const mongoose = require("mongoose");
const Student = require("../models/student.model");
const bcrypt = require("bcryptjs");
const CustomStrategy = require('passport-custom').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');

//contains much of the logic for logging in
//should be renamed passport.js


//function to help in the serialization and desirialisation of cookies
function SessionConstructor(userId, userGroup, details) {
    this.userId = userId;
    this.userGroup = userGroup; //User or Cafe
    this.details = details;
}
module.exports = function (passport) {
    passport.use('custom', new CustomStrategy((req, done) => {
        Student.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                return done(err, false);
            }
            if (!err && user !== null) {
                
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));






};


