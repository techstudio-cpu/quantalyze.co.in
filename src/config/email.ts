// Email Server Configuration for info@quantalyze.co.in
export const emailConfig = {
  // Email Server Settings
  username: 'info@quantalyze.co.in',
  password: process.env.EMAIL_PASSWORD || '', // Set this in environment variables
  
  // IMAP Configuration
  imap: {
    host: 'imap.quantalyze.co.in',
    port: 993, // 143 for non-SSL
    secure: true, // true for SSL, false for non-SSL
  },
  
  // POP3 Configuration
  pop3: {
    host: 'pop3.quantalyze.co.in',
    port: 995, // 110 for non-SSL
    secure: true, // true for SSL, false for non-SSL
  },
  
  // SMTP Configuration
  smtp: {
    host: 'smtp.quantalyze.co.in',
    port: 465, // 25 or 587 for non-SSL
    secure: true, // true for SSL, false for non-SSL
    auth: {
      user: 'info@quantalyze.co.in',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  },
};

// Contact Email Display
export const contactEmail = 'info@quantalyze.co.in';
