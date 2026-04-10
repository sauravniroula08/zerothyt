const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows your website to talk to this server

// 📧 Configuration - Change these with your details
const MY_GMAIL = 'sauravniroula54@gmail.com';
const MY_APP_PASSWORD = 'cbecwsmbligefxiw'; // Cleaned spaces for Nodemailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MY_GMAIL,
    pass: MY_APP_PASSWORD
  }
});

app.post('/api/order', (req, res) => {
  const data = req.body;
  console.log(`NEW ORDER REQUEST: ${data.orderId}`);

  const mailOptions = {
    from: MY_GMAIL,
    to: MY_GMAIL, 
    subject: `New Order Notification: ${data.service} - ${data.name}`,
    text: `OFFICIAL ORDER DATA - ZEROTH YT SHOP\n\n` +
          `Client Name: ${data.name}\n` +
          `Email Address: ${data.email}\n` +
          `Contact Number: ${data.phone}\n` +
          `Selected Service: ${data.service}\n` +
          `Additional Information: ${data.notes}\n` +
          `Submission Time: ${data.timestamp}\n\n` +
          `Reference ID: ${data.orderId}\n\n` +
          `--- \nYou may respond directly to this email to contact the client.`,
    replyTo: data.email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('SERVER ERROR: Email transmission failed:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: 'Order logging failed. Primary cause: Email transmission error.',
        error: error.message 
      });
    }
    console.log('SUCCESS: Order notification dispatched to administrator.');
    res.status(200).json({ success: true, message: 'Order request received and forwarded.' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ZEROTH SHOP BACKEND: ACTIVE`);
  console.log(`ENDPOINT: http://localhost:${PORT}/api/order`);
});

