import express from 'express';
import nodemailer from 'nodemailer';
import { db } from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message.' });
  }

  try {
    // 1. Save to DB
    const savedMessage = await db.messages.create({
      name,
      email,
      message,
      status: 'unread'
    });

    // 2. Setup Nodemailer Transporter using App Password
    // Ensure EMAIL_USER and EMAIL_PASS are in your .env file
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS is missing in .env. Email will not be sent, but message is saved to DB.');
      return res.status(200).json({ 
        success: true, 
        message: 'Message saved successfully! (Email sending disabled due to missing SMTP credentials in .env)',
        data: savedMessage
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Sending via authenticated Gmail
      replyTo: email, // If you click 'Reply' in Gmail, it goes to the sender
      to: process.env.EMAIL_USER, // Sending to yourself
      subject: `New Contact Form Message from ${name}`,
      text: `You have received a new message from your AI Resume Analyzer contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #4F46E5;">New Contact Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 8px; font-style: italic;">
            ${message.replace(/\n/g, '<br/>')}
          </p>
        </div>
      `
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      data: savedMessage
    });

  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
  }
});

export default router;
