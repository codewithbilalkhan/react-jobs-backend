const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { users, JWT_SECRET, authenticateToken, requireEmployer } = require('./auth');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] // Replace with your actual frontend domain
    : ['http://localhost:3002', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Path to jobs data file
const jobsFilePath = path.join(__dirname, 'jobs.json');

// Helper function to read jobs from file
const readJobsFromFile = () => {
  try {
    const data = fs.readFileSync(jobsFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    
    // Handle different data structures
    if (Array.isArray(parsedData)) {
      return parsedData;
    } else if (parsedData.jobs && Array.isArray(parsedData.jobs)) {
      return parsedData.jobs;
    } else {
      console.warn('Invalid jobs data structure, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error reading jobs file:', error);
    console.error('Looking for file at:', jobsFilePath);
    // Return sample data if file doesn't exist
    return [
      {
        "id": "1",
        "title": "Senior React Developer",
        "type": "Full-Time",
        "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA.",
        "location": "Boston, MA",
        "salary": "$70K - $80K",
        "company": {
          "name": "NewTek Solutions",
          "description": "NewTek Solutions is a leading technology company specializing in web development.",
          "contactEmail": "contact@teksolutions.com",
          "contactPhone": "555-555-5555"
        }
      }
    ];
  }
};

// Helper function to write jobs to file
const writeJobsToFile = (jobs) => {
  try {
    // Read the original file to check its structure
    const originalData = fs.readFileSync(jobsFilePath, 'utf8');
    const parsedOriginal = JSON.parse(originalData);
    
    // Maintain the original structure
    let dataToWrite;
    if (parsedOriginal.jobs && Array.isArray(parsedOriginal.jobs)) {
      // Original file has {jobs: [...]} structure
      dataToWrite = { jobs: jobs };
    } else {
      // Original file is just an array
      dataToWrite = jobs;
    }
    
    fs.writeFileSync(jobsFilePath, JSON.stringify(dataToWrite, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing jobs file:', error);
    // Fallback: write as object with jobs property
    try {
      fs.writeFileSync(jobsFilePath, JSON.stringify({ jobs: jobs }, null, 2));
      return true;
    } catch (fallbackError) {
      console.error('Fallback write also failed:', fallbackError);
      return false;
    }
  }
};

// Routes

// Authentication Routes

// POST /api/auth/login - User login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create simple token (in production use proper JWT)
    const token = Buffer.from(JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })).toString('base64') + '.token.signature';
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/signup - User registration
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (!['developer', 'employer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either developer or employer' });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password, // In production, hash this password
      role
    };
    
    users.push(newUser);
    
    // Create token
    const token = Buffer.from(JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    })).toString('base64') + '.token.signature';
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/auth/me - Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Job Routes (some protected)

// GET /api/jobs - Get all jobs
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = readJobsFromFile();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id - Get single job by ID
app.get('/api/jobs/:id', (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const job = jobs.find(j => j.id === req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs - Create new job (Employer only)
app.post('/api/jobs', authenticateToken, requireEmployer, (req, res) => {
  try {
    console.log('Creating new job with data:', req.body);
    console.log('User:', req.user);
    
    const jobs = readJobsFromFile();
    console.log('Current jobs count:', jobs.length);
    
    // Generate new ID
    const newId = (Math.max(...jobs.map(j => parseInt(j.id))) + 1).toString();
    console.log('Generated new ID:', newId);
    
    const newJob = {
      id: newId,
      ...req.body
    };
    
    jobs.push(newJob);
    console.log('New jobs count:', jobs.length);
    
    const writeResult = writeJobsToFile(jobs);
    console.log('Write result:', writeResult);
    
    if (writeResult) {
      console.log('Job created successfully:', newJob);
      res.status(201).json(newJob);
    } else {
      console.error('Failed to write jobs to file');
      res.status(500).json({ error: 'Failed to save job' });
    }
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id - Update existing job (Employer only)
app.put('/api/jobs/:id', authenticateToken, requireEmployer, (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const jobIndex = jobs.findIndex(j => j.id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Update job while keeping the ID
    jobs[jobIndex] = {
      id: req.params.id,
      ...req.body
    };
    
    if (writeJobsToFile(jobs)) {
      res.json(jobs[jobIndex]);
    } else {
      res.status(500).json({ error: 'Failed to update job' });
    }
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete job (Employer only)
app.delete('/api/jobs/:id', authenticateToken, requireEmployer, (req, res) => {
  try {
    const jobs = readJobsFromFile();
    const jobIndex = jobs.findIndex(j => j.id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    jobs.splice(jobIndex, 1);
    
    if (writeJobsToFile(jobs)) {
      res.json({ message: 'Job deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete job' });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});


// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'React Jobs API Server', 
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        me: '/api/auth/me'
      },
      jobs: {
        list: '/api/jobs',
        single: '/api/jobs/:id',
        create: '/api/jobs (POST)',
        update: '/api/jobs/:id (PUT)',
        delete: '/api/jobs/:id (DELETE)'
      }
    }
  });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jobs API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`ðŸš€ Jobs API server running on port ${PORT}`);
  console.log(`ðŸ“¡ API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
