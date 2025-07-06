import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, isAdmin } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    console.log('📩 Login request for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ No user found for email:', email);
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set in .env');
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error: any) {
    console.error('❌ Login error:', error.message || error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message || 'Unknown error'
    });
  }
};

