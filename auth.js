// Simple in-memory user storage (replace with database in production)
const users = [
  {
    id: 1,
    name: "John Developer",
    email: "developer@test.com",
    password: "password123", // In production, this should be hashed
    role: "developer"
  },
  {
    id: 2,
    name: "Jane Employer", 
    email: "employer@test.com",
    password: "password123", // In production, this should be hashed
    role: "employer"
  }
];

// Simple JWT secret (use environment variable in production)
const JWT_SECRET = "your-secret-key-here";

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  // For now, we'll use a simple token verification
  // In production, use proper JWT verification
  try {
    // Our token format is: base64data.token.signature
    // We need the first part (base64data)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3 || tokenParts[1] !== 'token') {
      return res.sendStatus(403);
    }
    
    const decoded = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.sendStatus(403);
  }
};

// Check if user is employer
const requireEmployer = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Access denied. Employer role required.' });
  }
  next();
};

module.exports = { users, JWT_SECRET, authenticateToken, requireEmployer };