const fs = require('fs');
const path = require('path');

// Path to jobs data file (in same directory)
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
    // Return sample data if file doesn not exist
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

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const jobs = readJobsFromFile();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};