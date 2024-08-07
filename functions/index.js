const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailler = require("nodemailler");
require("dotenv").config();

admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
});

// function to send email to the users aftrer booking for a location stay

exports.sendEmailToUser = functions.firestore
.document("usersBookings/docid")
.onCreate(async(snapshot)=>{
    const tourData = snapshot.data()
    const userEmail = tourData.email()

    const mailoptions = {
        from: process.env.USER_EMAIL,
        to: userEmail,
        subject: "Your booking confirmation",
        text: `Hi ${tourData.name}, \n Your booking for ${tourData.location} has been confirmed. \n Please check your booking details in the Firebase console.`,
    }
    try {
        await transporter.sendMail(mailoptions)
        console.log("Email sent to user")
    } catch (error) {
        console.error("Error sending email to user", error)
    }
});
    