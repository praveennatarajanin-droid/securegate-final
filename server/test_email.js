require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const nodemailer = require('nodemailer');

console.log('User:', process.env.EMAIL_USER);
console.log('Pass:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'praveen.natarajan.in@gmail.com', // Resident's email
    subject: 'Test Email from SecureGate',
    text: 'This is a test email to verify SMTP settings.'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('❌ Error:', error.message);
    } else {
        console.log('✅ Email sent:', info.response);
    }
});
