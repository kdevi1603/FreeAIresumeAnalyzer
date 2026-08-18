import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const userExists = await db.users.findOne({ email: email.trim().toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.users.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      lastLogin: new Date().toISOString()
    });

    // Log activity
    try {
      await db.activities.create({
        user: name,
        action: 'New User Registered',
        status: 'success'
      });
    } catch (e) {
      console.error('Failed to log activity', e);
    }

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

    const user = await db.users.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Update last login
    await db.users.update(user.id, { lastLogin: new Date().toISOString() });

    // Log activity
    try {
      await db.activities.create({
        user: user.name,
        action: 'Logged in successfully',
        status: 'success'
      });
    } catch (e) {
      console.error('Failed to log login activity', e);
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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

export async function setupAdmin(req, res) {
  try {
    const { name, email, password, adminSecret } = req.body;
    
    // Optional: Protect this with a secret in production, for now just check if any admin exists
    const admins = await db.users.find({ role: 'admin' });
    if (admins.length > 0) {
      return res.status(403).json({ message: 'Admin already setup.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await db.users.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin'
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Setup Admin Error:', error);
    return res.status(500).json({ message: 'Server error during admin setup.' });
  }
}
