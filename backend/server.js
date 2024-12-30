// Import required modules
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const qrcode = require('qrcode-terminal');

// Initialize the Express app
const app = express();
const PORT = 5000;

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Define paths for session and user data storage
const sessionPath = path.join(__dirname, 'session.json'); // Session data
const usersPath = path.join(__dirname, 'users_test.json'); // User data

// Load user data from the JSON file
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

// Initialize the WhatsApp client with LocalAuth for session persistence
const client = new Client({
  authStrategy: new LocalAuth(), // Use LocalAuth to store session data locally
  puppeteer: {
    headless: true, // Run in headless mode (no GUI)
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', // Path to Chrome executable
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional Puppeteer arguments
  },
});

// Event: QR code generation
client.on('qr', (qr) => {
  console.log('QR Code generated, scan it to log in.');
  qrcode.generate(qr, { small: true }); // Display QR code in the terminal
});

// Event: Successful authentication
client.on('authenticated', () => {
  console.log('Authenticated successfully!');
});

// Event: Client is ready to use
client.on('ready', () => {
  console.log('Client is ready!');
});

// Event: Authentication failure
client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

// Initialize the WhatsApp client
client.initialize();

/**
 * Sends a WhatsApp message to a specified phone number.
 * @param {string} phone - The recipient's phone number.
 * @param {string} message - The message to send.
 * @returns {Object} - An object indicating success or failure.
 */
async function sendWhatsAppMessage(phone, message) {
  try {
    // Remove non-numeric characters from the phone number
    const formattedPhone = phone.replace(/\D/g, '');

    // Validate the phone number format
    if (!/^\d{10,15}$/.test(formattedPhone)) {
      throw new Error('Invalid phone number format.');
    }

    console.log(`Sending message to: ${formattedPhone}`);

    // Ensure the WhatsApp client is ready
    if (!client.info) {
      throw new Error('WhatsApp client is not ready.');
    }

    // Check if the phone number is registered on WhatsApp
    const numberId = await client.getNumberId(formattedPhone);
    if (!numberId) {
      throw new Error('Phone number is not registered with WhatsApp.');
    }

    // Send the message to the recipient
    const chatId = numberId._serialized; // Use the serialized ID from getNumberId
    await client.sendMessage(chatId, message);
    console.log(`Message sent to ${formattedPhone}`);
    return { success: true, message: 'Message sent successfully!' };
  } catch (error) {
    console.error(`Failed to send message to ${phone}:`, error);
    return { success: false, message: 'Failed to send message. Ensure the phone number is valid and registered with WhatsApp.' };
  }
}

// API Endpoint: Get all users
app.get('/users', (req, res) => {
  res.json(users); // Return the list of users
});

// API Endpoint: Send a WhatsApp message
app.post('/sendWhatsApp', async (req, res) => {
  const { phone, message } = req.body;

  // Validate the phone number format
  if (!/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format.' });
  }

  // Ensure the WhatsApp client is ready
  if (!client.info) {
    return res.status(503).json({ success: false, message: 'WhatsApp client is not ready.' });
  }

  // Send the WhatsApp message and return the result
  const result = await sendWhatsAppMessage(phone, message);
  res.json(result);
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});