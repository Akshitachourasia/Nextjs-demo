// import nodemailer from "nodemailer";
// import User from "../models/userModel"
// import bcryptjs from 'bcryptjs'
// export const sendEmail = async ({ email, emailType, userId }: any) => {

//     try {
//         const hashedToken = await bcryptjs.hash(userId.toString(), 10)
//         if (emailType === 'VERIFY') {
//             const updtedUser = await User.findByIdAndUpdate(userId, {
//                 $set: {

//                     verifyToken: hashedToken, verifyTokenExpiry: new Date(Date.now() + 3600000)
//                 }
//             })
//         }
//         else if (emailType === 'RESET') {await User.findByIdAndUpdate(userId,
//                 {
//                     $set: {
//                         forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: new Date(Date.now() + 3600000)
//                     }
//                 })
//         }
//         var transport = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: "6875e07eff2b9c",
//                 pass: "856fbd03d94210"
//             }
//         });

//         const mailOptions = {

//             from: 'akshita@akshita.ai',
//             to: email,
//             subject: emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password',
//             html: `<p> Click on <a href="${process.env.DOMAIN}/verifyemail/${hashedToken}"> here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste this link in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
//         }
//         const mailResponse = await transport.sendMail(mailOptions)
//     }
//     catch (error: any) {
//         throw new Error(error.message)
//     }

// }


import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }:any) => {
    try {
        // Check if TOKEN_SECRET is defined
        if (!process.env.TOKEN_SECRET) {
            throw new Error('TOKEN_SECRET is not defined in environment variables');
        }

        // Generate a unique token
        const token = jwt.sign({ userId, emailType }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Update user document based on email type
        const updateFields = emailType === 'VERIFY' 
            ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 } 
            : { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };
        await User.findByIdAndUpdate(userId, { $set: updateFields });

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "6875e07eff2b9c",
                pass: "856fbd03d94210"
            }
        });

        // Compose email options
        const mailOptions = {
            from: 'akshita@akshita.ai',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password',
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail/${token}">here</a> to ${emailType === 'VERIFY' ? 'verify your email' : 'reset your password'} or copy and paste this link in your browser.<br>${process.env.DOMAIN}/verifyemail?token=${token}</p>`,
        };

        // Send email
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse);

    } catch (error:any) {
        // Handle errors
        console.error("Error sending email:", error);
        throw new Error(error.message);
    }
};
