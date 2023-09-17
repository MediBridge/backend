const express = require("express");
const cors = require("cors");
//ROUTING IMPORTS
const fileRoutes = require('./routes/FileHandling');
const passwordRoutes = require('./routes/PasswordHandling');


const app = express();
const port = process.env.PORT || 3000;


app.use(
  cors({
    origin: "http://localhost:1234", // Replace with your React app's URL
  })
);
app.use(express.json());


app.get('/api/healthcheck',(req,res)=>{
  res.status(200).json({msg:"Working fine!"});
})

// ALL FILE HANDLING ROUTES THAT INCLUDE File Encryption, File Decryption, Plain File Upload to IPFS.

app.use('/api/file',fileRoutes);

// PASSWORD SHARING ROUTES

app.use('/api/password/',passwordRoutes);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
