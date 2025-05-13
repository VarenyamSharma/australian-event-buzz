
// Example email service using nodemailer

const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send confirmation email
const sendConfirmationEmail = async (email, eventName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Ticket Confirmation for ${eventName}`,
      html: `
        <h1>Thank you for your interest in ${eventName}</h1>
        <p>You have been redirected to the ticket provider's website to complete your purchase.</p>
        <p>If you have any questions, please contact us at info@sydneyeventbuzz.com.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

// Send newsletter email (for opted-in users)
const sendNewsletterEmail = async (email, events) => {
  try {
    const eventsHTML = events.map(event => `
      <div>
        <h2>${event.title}</h2>
        <p>${event.date} at ${event.time}</p>
        <p>${event.venue}</p>
        <a href="${event.ticketUrl}">Get Tickets</a>
      </div>
      <hr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Events in Sydney This Week',
      html: `
        <h1>Sydney Event Buzz - New Events</h1>
        <p>Check out these exciting new events in Sydney:</p>
        ${eventsHTML}
        <p>To unsubscribe, click <a href="http://sydneyeventbuzz.com/unsubscribe?email=${email}">here</a>.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Newsletter email sent to ${email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error };
  }
};

module.exports = {
  sendConfirmationEmail,
  sendNewsletterEmail,
};
