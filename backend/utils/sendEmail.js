const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to another service if needed
        auth: {
            user: process.env.EMAIL_USER || 'Tarunsaikolaa@gmail.com',
            pass: process.env.EMAIL_PASS, // App password
        },
    });

    // Define email options
    const mailOptions = {
        from: `"Doltec Support" <${process.env.EMAIL_USER || 'Tarunsaikolaa@gmail.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
