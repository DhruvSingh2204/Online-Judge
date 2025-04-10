const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const peopleDB = require('../models/people')
require('dotenv').config()
// const nodemailer = require('nodemailer');
// const sendOTP = require('../utils/mailer');
// const otpStore = new Map();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// const sendOTP = async (email, otp) => {
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'OTP Verification',
//         text: `Your OTP code is: ${otp}`
//     };

//     await transporter.sendMail(mailOptions);
// };

exports.login = async (req, res) => {
    const { userName, password } = req.body;

    try {
        if (!userName) {
            console.log('no username')
            return res.status(200).json({ 'message': `please input userName` })
        }
        if (!password) {
            console.log('no password')
            return res.status(200).json({ 'message': `please input password` })
        }
        const foundUser = await peopleDB.findOne({ username: userName })

        if (!foundUser) {
            return res.status(200).json({ 'message': `User not found` })
        }

        const pwdMatch = await bcrypt.compare(password, foundUser.password);

        if (!pwdMatch) {
            return res.status(200).json({ 'message': `Wrong Password` });
        }

        console.log(`${userName} Logged In!!`)

        const token = jwt.sign(
            { id: foundUser._id, userName: foundUser.username, email: foundUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            'message': `User ${foundUser.username} logged in!!`,
            'token': token,
            'user': {
                id: foundUser._id,
                userName: foundUser.username,
                email: foundUser.email,
            }
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ 'message': `Internal Server Error` })
    }
}

exports.signUp = async (req, res) => {
    const { userName, password, email } = req.body;

    try {
        if (!userName) {
            console.log('no username')
            return res.status(200).json({ 'message': `please input userName` })
        }
        if (!password) {
            console.log('no password')
            return res.status(200).json({ 'message': `please input password` })
        }
        if (!email) {
            console.log('no email')
            return res.status(200).json({ 'message': `please input email` })
        }
        const foundUser = await peopleDB.findOne({ username: userName });

        if (foundUser) {
            res.json({ 'message': `Duplicate userName, try another userName` });
            return 'Duplicate Username';
        }

        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = await peopleDB.create({
            username: userName,
            password: hashedPwd,
            email: email
        });

        console.log(newUser);

        const token = jwt.sign(
            { id: newUser._id, userName: newUser.username, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // return res.status(200).json({
        //     'message': `New User - ${newUser.username} created`,
        //     'token' : token,
        //     'user': {
        //         id: newUser._id,
        //         userName: newUser.username,
        //         email: newUser.email,
        //     }
        // });

        return res.status(200).json({
            'message': `New User - ${newUser.username} created`,
            'token': token,
            'user': {
                id: newUser._id,
                userName: newUser.username,
                email: newUser.email,
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ 'message': `Internal Server Error` });
    }
}

// exports.verifyOTP = async (req, res) => {
//     const { email, otp } = req.body;

//     const stored = otpStore.get(email);
//     if (!stored) return res.status(400).json({ message: 'No OTP requested for this email' });

//     if (Date.now() - stored.createdAt > 5 * 60 * 1000) {
//         otpStore.delete(email);
//         return res.status(400).json({ message: 'OTP expired' });
//     }

//     if (parseInt(otp) !== stored.otp) {
//         return res.status(400).json({ message: 'Incorrect OTP' });
//     }

//     const hashedPwd = await bcrypt.hash(stored.data.password, 10);
//     const newUser = await peopleDB.create({
//         username: stored.data.userName,
//         password: hashedPwd,
//         email: stored.data.email
//     });

//     otpStore.delete(email); // Clear OTP after use

//     const token = jwt.sign(
//         { id: newUser._id, userName: newUser.username, email: newUser.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//     );

//     return res.status(200).json({
//         message: `User ${newUser.username} created successfully`,
//         token,
//         user: {
//             id: newUser._id,
//             userName: newUser.username,
//             email: newUser.email,
//         }
//     });
// };

exports.fetchUserData = async (req, res) => {
    const { correctUN } = req.body;

    const ans = await peopleDB.find({ username: correctUN })

    return res.status(200).json(ans);
}

// module.exports = sendOTP;