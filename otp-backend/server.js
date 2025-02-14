const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'  // Allow requests from React frontend
}));

// Store OTPs temporarily (for demonstration)
const otpStore = {};

// Configure Nodemailer to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'votingproject376@gmail.com',
        pass: 'oyql svze kfuy cfkn'  // Use an App Password for Gmail
    }
});

// Helper function to generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Endpoint to send OTP to email
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    otpStore[email] = otp;

    try {
        await transporter.sendMail({
            from: 'votingproject376@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}`
        });

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Email sending failed:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
});

// Endpoint to verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === parseInt(otp)) {
        delete otpStore[email];  // OTP is verified, remove it from store
        return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
});


// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));