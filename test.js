import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connect, getDB } from './db.js';
import { initialize, authenticate } from './authMiddleware.js';

const app = express();
const tokenBlacklist = new Set(); // Token blacklist to store expired tokens

// Middleware
app.use(express.json())

// Connect to MongoDB
connect();

// Routes
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDB();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Insert the user into the database
    const result = await db.collection('users').insertOne(newUser);

    if (result.insertedCount === 1) {
      return res.status(201).json({ message: 'User created successfully' });
    }

    return res.status(500).json({ message: 'Failed to create user' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/login', authenticate(), (req, res) => {
  try {
    const { user } = req;
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Protected route
app.get('/protected', authenticate(), (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Logout route (invalidate the JWT)
app.post('/logout', (req, res) => {
  const { token } = req.body;

  if (token) {
    tokenBlacklist.add(token); // Add the token to the blacklist
  }

  res.json({ message: 'Logged out successfully' });
});

function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

  return token;
}

function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

function authenticateWithBlacklist() {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token || isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = decoded;
      next();
    });
  };
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
