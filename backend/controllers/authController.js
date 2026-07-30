import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const userExists = await db.users.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.users.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error during registration.' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await db.users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
}

export async function getMe(req, res) {
  try {
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving user profile.' });
  }
}
