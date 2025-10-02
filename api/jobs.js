module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Sample jobs data
  const jobs = [
    {
      "id": "1",
      "title": "Senior React Developer",
      "type": "Full-Time",
      "description": "We are seeking a talented Front-End Developer to join our team in Boston, MA. Work with React, TypeScript, and modern tools.",
      "location": "Boston, MA",
      "salary": "$70K - $80K",
      "company": {
        "name": "NewTek Solutions",
        "description": "NewTek Solutions is a leading technology company specializing in web development and digital solutions.",
        "contactEmail": "contact@teksolutions.com",
        "contactPhone": "555-555-5555"
      }
    },
    {
      "id": "2",
      "title": "Frontend Developer",
      "type": "Part-Time",
      "description": "Join our team as a Frontend Developer. Experience with React and modern JavaScript required.",
      "location": "Miami, FL",
      "salary": "$60K - $70K",
      "company": {
        "name": "WebDev Corp",
        "description": "WebDev Corp creates innovative web solutions for businesses worldwide.",
        "contactEmail": "jobs@webdevcorp.com",
        "contactPhone": "555-555-5556"
      }
    },
    {
      "id": "3",
      "title": "Full Stack Developer",
      "type": "Full-Time",
      "description": "Looking for a Full Stack Developer with experience in React, Node.js, and databases.",
      "location": "New York, NY",
      "salary": "$80K - $90K",
      "company": {
        "name": "Tech Innovators",
        "description": "Tech Innovators is at the forefront of technological advancement and digital transformation.",
        "contactEmail": "careers@techinnovators.com",
        "contactPhone": "555-555-5557"
      }
    }
  ];

  res.status(200).json(jobs);
};