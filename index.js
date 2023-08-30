const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const crypto = require('crypto');
const {uploadData,getDataFromIpfs} = require("./utils/IPFS");
const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });
app.use(cors({
  origin: 'http://localhost:1234' // Replace with your React app's URL
}));
app.use(express.json())
// Replace 'your-secret-key' with the actual key you want to use for encryption
const secretKey = crypto.createHash('sha256').update(String("mine")).digest('base64').substr(0, 32);

// AES encryption function
const encryptAES = (text) => {
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
};

// AES decryption function
const decryptAES = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
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
    console.log( JSON.stringify(encryptedPDFText) );
    const hashed = uploadData(JSON.stringify(encryptedPDFText) );
    res.status(200).send('PDF file uploaded, processed, and encrypted successfully.',hashed);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred during processing.');
  }
});

// Set up a route to handle decryption
app.post('/decrypt',async (req, res) => {
  try {
    const {url} =req.body;
    const data = await getDataFromIpfs(url);
    console.log( (data));
    const { iv, encryptedData } = (data);

    // Decrypt the encrypted data using AES decryption
    const decryptedText = decryptAES(encryptedData, iv);

    res.status(200).json({ decryptedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred during decryption.');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
