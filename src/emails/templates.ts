export const getThankYouTemplate = (name: string) => ({
  subject: 'Thank You for Subscribing to Quantalyze!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4f46e5;">Welcome to Quantalyze!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for subscribing to our newsletter! We're excited to have you on board.</p>
      <p>You'll now receive our latest updates, insights, and special offers directly to your inbox.</p>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br/>The Quantalyze Team</p>
      <hr/>
      <p style="font-size: 12px; color: #666;">
        <a href="%unsubscribe_url%" style="color: #4f46e5;">Unsubscribe</a> | 
        <a href="https://quantalyze.co.in" style="color: #4f46e5;">Visit our website</a>
      </p>
    </div>
  `,
  text: `
    Welcome to Quantalyze!

    Dear ${name},

    Thank you for subscribing to our newsletter! We're excited to have you on board.

    You'll now receive our latest updates, insights, and special offers directly to your inbox.

    If you have any questions, feel free to reply to this email.

    Best regards,
    The Quantalyze Team

    ---
    Unsubscribe: %unsubscribe_url%
    Visit our website: https://quantalyze.co.in
  `,
});

export const getInquiryDraftTemplate = (inquiry: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) => ({
  subject: `New Inquiry from ${inquiry.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4f46e5;">New Inquiry Received</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      ${inquiry.phone ? `<p><strong>Phone:</strong> ${inquiry.phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${inquiry.message.replace(/\n/g, '<br/>')}
      </div>
      <p>This is a draft email. Please review and send a response.</p>
    </div>
  `,
});
