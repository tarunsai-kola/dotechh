const nodemailer = require('nodemailer');

// Create a transporter
// For development, we can use Ethereal or just console.log if no env vars
// For production, use real SMTP details from process.env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!to) {
            console.warn('EmailService: No recipient defined');
            return;
        }

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Doltec Support" <no-reply@doltec.com>',
            to,
            subject,
            text,
            html
        });

        console.log(`Email sent: ${info.messageId}`);
        // Preview only available when sending through an Ethereal account
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error to avoid breaking the main flow, just log it
    }
};

module.exports = sendEmail;
