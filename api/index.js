const express = require('express');const express = require('express');

const cors = require('cors');const cors = require('cors');

const fs = require('fs');const fs = require('fs');

const path = require('path');const path = require('path');

const { users, JWT_SECRET, authenticateToken, requireEmployer } = require('../auth');

// Auth configuration (inline to avoid import issues)

const JWT_SECRET = 'your-secret-key';const app = express();



const users = [// Middleware

  {app.use(cors());

    id: 1,app.use(express.json());

    name: 'John Employer',

    email: 'employer@example.com',// Path to jobs data file

    password: 'password123',const jobsFilePath = path.join(__dirname, '../jobs.json');

    role: 'employer'

  },// Helper function to read jobs from file

  {const readJobsFromFile = () => {

    id: 2,  try {

    name: 'Jane Developer',    const data = fs.readFileSync(jobsFilePath, 'utf8');

    email: 'developer@example.com',    const parsedData = JSON.parse(data);

    password: 'password123',    

    role: 'developer'    // Handle different data structures

  }    if (Array.isArray(parsedData)) {

];      return parsedData;

    } else if (parsedData.jobs && Array.isArray(parsedData.jobs)) {

// Auth middleware      return parsedData.jobs;

const authenticateToken = (req, res, next) => {    } else {

  const authHeader = req.headers['authorization'];      console.warn('Invalid jobs data structure, returning empty array');

  const token = authHeader && authHeader.split(' ')[1];      return [];

    }

  if (!token) {  } catch (error) {

    return res.status(401).json({ error: 'Access token required' });    console.error('Error reading jobs file:', error);

  }    console.error('Looking for file at:', jobsFilePath);

    // Return sample data if file doesn not exist

  try {    return [

    // Simple token validation (decode base64)      {

    const tokenData = token.replace('.token.signature', '');        "id": "1",

    const decoded = JSON.parse(Buffer.from(tokenData, 'base64').toString());        "title": "Senior React Developer",

    req.user = decoded;        "type": "Full-Time",

    next();        "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA.",

  } catch (error) {        "location": "Boston, MA",

    return res.status(403).json({ error: 'Invalid token' });        "salary": "$70K - $80K",

  }        "company": {

};          "name": "NewTek Solutions",

          "description": "NewTek Solutions is a leading technology company specializing in web development.",

const requireEmployer = (req, res, next) => {          "contactEmail": "contact@teksolutions.com",

  if (req.user.role !== 'employer') {          "contactPhone": "555-555-5555"

    return res.status(403).json({ error: 'Employer role required' });        }

  }      }

  next();    ];

};  }

};

const app = express();

// Helper function to write jobs to file

// Middlewareconst writeJobsToFile = (jobs) => {

app.use(cors());  try {

app.use(express.json());    // Read the original file to check its structure

    const originalData = fs.readFileSync(jobsFilePath, 'utf8');

// Path to jobs data file (in same directory)    const parsedOriginal = JSON.parse(originalData);

const jobsFilePath = path.join(__dirname, 'jobs.json');    

    // Maintain the original structure

// Helper function to read jobs from file    let dataToWrite;

const readJobsFromFile = () => {    if (parsedOriginal.jobs && Array.isArray(parsedOriginal.jobs)) {

  try {      // Original file has {jobs: [...]} structure

    const data = fs.readFileSync(jobsFilePath, 'utf8');      dataToWrite = { jobs: jobs };

    const parsedData = JSON.parse(data);    } else {

          // Original file is just an array

    // Handle different data structures      dataToWrite = jobs;

    if (Array.isArray(parsedData)) {    }

      return parsedData;    

    } else if (parsedData.jobs && Array.isArray(parsedData.jobs)) {    fs.writeFileSync(jobsFilePath, JSON.stringify(dataToWrite, null, 2));

      return parsedData.jobs;    return true;

    } else {  } catch (error) {

      console.warn('Invalid jobs data structure, returning empty array');    console.error('Error writing jobs file:', error);

      return [];    // Fallback: write as object with jobs property

    }    try {

  } catch (error) {      fs.writeFileSync(jobsFilePath, JSON.stringify({ jobs: jobs }, null, 2));

    console.error('Error reading jobs file:', error);      return true;

    console.error('Looking for file at:', jobsFilePath);    } catch (fallbackError) {

    // Return sample data if file doesn not exist      console.error('Fallback write failed:', fallbackError);

    return [      return false;

      {    }

        "id": "1",  }

        "title": "Senior React Developer",};

        "type": "Full-Time",

        "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA.",// Root route

        "location": "Boston, MA",app.get('/', (req, res) => {

        "salary": "$70K - $80K",  res.json({ 

        "company": {    message: 'React Jobs API Server', 

          "name": "NewTek Solutions",    status: 'running',

          "description": "NewTek Solutions is a leading technology company specializing in web development.",    endpoints: {

          "contactEmail": "contact@teksolutions.com",      health: '/api/health',

          "contactPhone": "555-555-5555"      auth: {

        }        login: '/api/auth/login',

      }        signup: '/api/auth/signup',

    ];        me: '/api/auth/me'

  }      },

};      jobs: {

        list: '/api/jobs',

// Helper function to write jobs to file        single: '/api/jobs/:id',

const writeJobsToFile = (jobs) => {        create: '/api/jobs (POST)',

  try {        update: '/api/jobs/:id (PUT)',

    // Read the original file to check its structure        delete: '/api/jobs/:id (DELETE)'

    const originalData = fs.readFileSync(jobsFilePath, 'utf8');      }

    const parsedOriginal = JSON.parse(originalData);    }

  });

    // Maintain the original structure});

    let dataToWrite;

    if (parsedOriginal.jobs && Array.isArray(parsedOriginal.jobs)) {// Auth Routes

      // Original file has {jobs: [...]} structureapp.post('/api/auth/login', (req, res) => {

      dataToWrite = { jobs: jobs };  try {

    } else {    const { email, password } = req.body;

      // Original file is just an array    

      dataToWrite = jobs;    if (!email || !password) {

    }      return res.status(400).json({ error: 'Email and password are required' });

    }

    fs.writeFileSync(jobsFilePath, JSON.stringify(dataToWrite, null, 2));    

    return true;    // Find user

  } catch (error) {    const user = users.find(u => u.email === email && u.password === password);

    console.error('Error writing jobs file:', error);    

    // Fallback: write as object with jobs property    if (!user) {

    try {      return res.status(401).json({ error: 'Invalid credentials' });

      fs.writeFileSync(jobsFilePath, JSON.stringify({ jobs: jobs }, null, 2));    }

      return true;    

    } catch (fallbackError) {    // Create token

      console.error('Fallback write failed:', fallbackError);    const token = Buffer.from(JSON.stringify({

      return false;      id: user.id,

    }      name: user.name,

  }      email: user.email,

};      role: user.role

    })).toString('base64') + '.token.signature';

// Root route    

app.get('/', (req, res) => {    res.json({

  res.json({      message: 'Login successful',

    message: 'React Jobs API Server',      token,

    status: 'running',      user: {

    endpoints: {        id: user.id,

      health: '/api/health',        name: user.name,

      auth: {        email: user.email,

        login: '/api/auth/login',        role: user.role

        signup: '/api/auth/signup',      }

        me: '/api/auth/me'    });

      },  } catch (error) {

      jobs: {    console.error('Login error:', error);

        list: '/api/jobs',    res.status(500).json({ error: 'Login failed' });

        single: '/api/jobs/:id',  }

        create: '/api/jobs (POST)',});

        update: '/api/jobs/:id (PUT)',

        delete: '/api/jobs/:id (DELETE)'app.post('/api/auth/signup', (req, res) => {

      }  try {

    }    const { name, email, password, role } = req.body;

  });    

});    if (!name || !email || !password || !role) {

      return res.status(400).json({ error: 'All fields are required' });

// Auth Routes    }

app.post('/api/auth/login', (req, res) => {    

  try {    if (!['developer', 'employer'].includes(role)) {

    const { email, password } = req.body;      return res.status(400).json({ error: 'Role must be either developer or employer' });

    }

    if (!email || !password) {    

      return res.status(400).json({ error: 'Email and password are required' });    // Check if user already exists

    }    const existingUser = users.find(u => u.email === email);

    if (existingUser) {

    // Find user      return res.status(409).json({ error: 'User already exists' });

    const user = users.find(u => u.email === email && u.password === password);    }

    

    if (!user) {    // Create new user

      return res.status(401).json({ error: 'Invalid credentials' });    const newUser = {

    }      id: users.length + 1,

      name,

    // Create token      email,

    const token = Buffer.from(JSON.stringify({      password, // In production, hash this password

      id: user.id,      role

      name: user.name,    };

      email: user.email,    

      role: user.role    users.push(newUser);

    })).toString('base64') + '.token.signature';    

    // Create token

    res.json({    const token = Buffer.from(JSON.stringify({

      message: 'Login successful',      id: newUser.id,

      token,      name: newUser.name,

      user: {      email: newUser.email,

        id: user.id,      role: newUser.role

        name: user.name,    })).toString('base64') + '.token.signature';

        email: user.email,    

        role: user.role    res.status(201).json({

      }      message: 'Registration successful',

    });      token,

  } catch (error) {      user: {

    console.error('Login error:', error);        id: newUser.id,

    res.status(500).json({ error: 'Login failed' });        name: newUser.name,

  }        email: newUser.email,

});        role: newUser.role

      }

app.post('/api/auth/signup', (req, res) => {    });

  try {  } catch (error) {

    const { name, email, password, role } = req.body;    console.error('Signup error:', error);

    res.status(500).json({ error: 'Registration failed' });

    if (!name || !email || !password || !role) {  }

      return res.status(400).json({ error: 'All fields are required' });});

    }

app.get('/api/auth/me', authenticateToken, (req, res) => {

    if (!['developer', 'employer'].includes(role)) {  res.json({ user: req.user });

      return res.status(400).json({ error: 'Role must be either developer or employer' });     });

    }

// Job Routes

    // Check if user already existsapp.get('/api/jobs', (req, res) => {

    const existingUser = users.find(u => u.email === email);  try {

    if (existingUser) {    const jobs = readJobsFromFile();

      return res.status(409).json({ error: 'User already exists' });    res.json(jobs);

    }  } catch (error) {

    res.status(500).json({ error: 'Failed to fetch jobs' });

    // Create new user  }

    const newUser = {});

      id: users.length + 1,

      name,app.get('/api/jobs/:id', (req, res) => {

      email,  try {

      password, // In production, hash this password    const jobs = readJobsFromFile();

      role    const job = jobs.find(j => j.id === req.params.id);

    };    

    if (!job) {

    users.push(newUser);      return res.status(404).json({ error: 'Job not found' });

    }

    // Create token    

    const token = Buffer.from(JSON.stringify({    res.json(job);

      id: newUser.id,  } catch (error) {

      name: newUser.name,    res.status(500).json({ error: 'Failed to fetch job' });

      email: newUser.email,  }

      role: newUser.role});

    })).toString('base64') + '.token.signature';

app.post('/api/jobs', authenticateToken, requireEmployer, (req, res) => {

    res.status(201).json({  try {

      message: 'Registration successful',    const jobs = readJobsFromFile();

      token,    

      user: {    // Generate new ID

        id: newUser.id,    const newId = (Math.max(...jobs.map(j => parseInt(j.id))) + 1).toString();

        name: newUser.name,    

        email: newUser.email,    const newJob = {

        role: newUser.role      id: newId,

      }      ...req.body

    });    };

  } catch (error) {    

    console.error('Signup error:', error);    jobs.push(newJob);

    res.status(500).json({ error: 'Registration failed' });    

  }    if (writeJobsToFile(jobs)) {

});      res.status(201).json(newJob);

    } else {

app.get('/api/auth/me', authenticateToken, (req, res) => {      res.status(500).json({ error: 'Failed to save job' });

  res.json({ user: req.user });    }

});  } catch (error) {

    console.error('Error creating job:', error);

// Job Routes    res.status(500).json({ error: 'Failed to create job' });

app.get('/api/jobs', (req, res) => {  }

  try {});

    const jobs = readJobsFromFile();

    res.json(jobs);app.put('/api/jobs/:id', authenticateToken, requireEmployer, (req, res) => {

  } catch (error) {  try {

    res.status(500).json({ error: 'Failed to fetch jobs' });    const jobs = readJobsFromFile();

  }    const jobIndex = jobs.findIndex(j => j.id === req.params.id);

});    

    if (jobIndex === -1) {

app.get('/api/jobs/:id', (req, res) => {      return res.status(404).json({ error: 'Job not found' });

  try {    }

    const jobs = readJobsFromFile();    

    const job = jobs.find(j => j.id === req.params.id);    // Update job while keeping the ID

    jobs[jobIndex] = {

    if (!job) {      id: req.params.id,

      return res.status(404).json({ error: 'Job not found' });      ...req.body

    }    };

    

    res.json(job);    if (writeJobsToFile(jobs)) {

  } catch (error) {      res.json(jobs[jobIndex]);

    res.status(500).json({ error: 'Failed to fetch job' });    } else {

  }      res.status(500).json({ error: 'Failed to update job' });

});    }

  } catch (error) {

app.post('/api/jobs', authenticateToken, requireEmployer, (req, res) => {    console.error('Error updating job:', error);

  try {    res.status(500).json({ error: 'Failed to update job' });

    const jobs = readJobsFromFile();  }

});

    // Generate new ID

    const newId = (Math.max(...jobs.map(j => parseInt(j.id))) + 1).toString();app.delete('/api/jobs/:id', authenticateToken, requireEmployer, (req, res) => {

  try {

    const newJob = {    const jobs = readJobsFromFile();

      id: newId,    const jobIndex = jobs.findIndex(j => j.id === req.params.id);

      ...req.body    

    };    if (jobIndex === -1) {

          return res.status(404).json({ error: 'Job not found' });

    jobs.push(newJob);    }

    

    if (writeJobsToFile(jobs)) {    jobs.splice(jobIndex, 1);

      res.status(201).json(newJob);    

    } else {    if (writeJobsToFile(jobs)) {

      res.status(500).json({ error: 'Failed to save job' });      res.json({ message: 'Job deleted successfully' });

    }    } else {

  } catch (error) {      res.status(500).json({ error: 'Failed to delete job' });

    console.error('Error creating job:', error);    }

    res.status(500).json({ error: 'Failed to create job' });  } catch (error) {

  }    console.error('Error deleting job:', error);

});    res.status(500).json({ error: 'Failed to delete job' });

  }

app.put('/api/jobs/:id', authenticateToken, requireEmployer, (req, res) => {});

  try {

    const jobs = readJobsFromFile();// Health check endpoint

    const jobIndex = jobs.findIndex(j => j.id === req.params.id);app.get('/api/health', (req, res) => {

  res.json({ status: 'OK', message: 'Jobs API is running' });

    if (jobIndex === -1) {});

      return res.status(404).json({ error: 'Job not found' });

    }// Export for Vercel

module.exports = app;

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jobs API is running' });
});

// Export for Vercel
module.exports = app;