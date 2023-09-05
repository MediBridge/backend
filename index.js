const express = require("express");
const multer = require("multer");
const pdf = require("pdf-parse");
const cors = require("cors");
const crypto = require("crypto");
const { uploadData, getDataFromIpfs } = require("./utils/IPFS");
const { encryptAES, decryptAES } = require("./utils/SerDe");

const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });
app.use(
  cors({
    origin: "http://localhost:1234", // Replace with your React app's URL
  })
);
app.use(express.json());
// Replace 'your-secret-key' with the actual key you want to use for encryption

// Set up a route to handle file upload
app.post("/fileUpload", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No PDF file uploaded.");
    }
    console.log(req.body);
    if (!req.body.key)
      return res.status(400).send("Missing important parameters key");
    console.log(req.body.key);
    const secretKey = crypto
      .createHash("sha256")
      .update(String(req.body.key))
      .digest("base64")
      .substring(0, 32);

    const pdfBuffer = req.file.buffer;
    const pdfData = await pdf(pdfBuffer);

    // Process the PDF data as needed
    const pdfText = pdfData.text;
    // Encrypt the PDF text data using AES encryption
    const encryptedPDFText = encryptAES(pdfText, secretKey);

    // You can now process the encrypted text or perform any other tasks
    console.log(JSON.stringify(encryptedPDFText));
    const hashed = await uploadData(JSON.stringify(encryptedPDFText));
    console.log(
      `PDF file uploaded, processed, and encrypted successfully. ${hashed}`
    );
    res.status(200).json(hashed);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred during processing.");
  }
});

// Set up a route to handle decryption
app.post("/decrypt", async (req, res) => {
  try {
    const { url, key } = req.body;
    console.log(req.body);
    if (!url || !key)
    return res.status(400).send("Missing important parameters url or key");

    const secretKey = crypto
      .createHash("sha256")
      .update(String(key))
      .digest("base64")
      .substring(0, 32);
    const data = await getDataFromIpfs(url);
    const { iv, encryptedData } = data;

    // Decrypt the encrypted data using AES decryption
    const decryptedText = decryptAES(encryptedData, iv,secretKey);
    res.status(200).json({ decryptedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred during decryption.");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
