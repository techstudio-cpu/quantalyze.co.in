// Bulk update script for your Railway database
const fetch = require('node-fetch');

const API_BASE = 'https://quantalyze-co-in-production.up.railway.app/api/admin';

// Get auth token first
async function getAuthToken() {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Admin', password: 'Admin@123' })
  });
  const data = await response.json();
  return data.token;
}

// Update services
async function updateServices(token) {
  const services = [
    { id: 1, title: "Social Media Marketing", description: "Updated description", price: "$999/month" },
    { id: 2, title: "Website Development", description: "Updated web development services", price: "$1999" },
    // Add more services as needed
  ];

  for (const service of services) {
    await fetch(`${API_BASE}/services/${service.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(service)
    });
    console.log(`Updated service: ${service.title}`);
  }
}

// Update team members
async function updateTeam(token) {
  const team = [
    { id: 1, name: "John Doe", email: "john@quantalyze.co.in", role: "CEO", department: "Management" },
    { id: 2, name: "Jane Smith", email: "jane@quantalyze.co.in", role: "CTO", department: "Technical" },
    // Add more team members as needed
  ];

  for (const member of team) {
    await fetch(`${API_BASE}/team/${member.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(member)
    });
    console.log(`Updated team member: ${member.name}`);
  }
}

// Run updates
async function main() {
  try {
    const token = await getAuthToken();
    console.log('Got auth token');
    
    await updateServices(token);
    await updateTeam(token);
    
    console.log('All updates completed!');
  } catch (error) {
    console.error('Update failed:', error);
  }
}

main();
