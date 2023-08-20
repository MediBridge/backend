const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });
app.use(cors({
  origin: 'http://localhost:1234' // Replace with your React app's URL
}));

// Replace 'your-secret-key' with the actual key you want to use for encryption
const secretKey = 'myKey';

// AES encryption function
const encryptAES = (text) => {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// Set up a route to handle file upload
app.post('/fileUpload', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No PDF file uploaded.');
    }

    const pdfBuffer = req.file.buffer;
    const pdfData = await pdf(pdfBuffer);

    // Process the PDF data as needed
    const pdfText = pdfData.text;

    // Encrypt the PDF text data using AES encryption
    const encryptedPDFText = encryptAES(pdfText);
    
    // You can now process the encrypted text or perform any other tasks
    console.log(encryptedPDFText);
    res.status(200).send('PDF file uploaded, processed, and encrypted successfully.');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred during processing.');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
