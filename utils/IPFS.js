const dotenv = require('dotenv');
dotenv.config()
const lighthouse = require('@lighthouse-web3/sdk');
const axios = require('axios');
const uploadData = async (text) => {
  const apiKey = process.env.LIGHTHOUSE_KEY; // Generate from https://files.lighthouse.storage/ or CLI (lighthouse-web3 api-key --new)
  
  const response = await lighthouse.uploadText(
    text,
    apiKey
  );
  
  // Display response
  console.log(response);
  console.log("https://gateway.lighthouse.storage/ipfs/" + response.data.Hash);
  return "https://gateway.lighthouse.storage/ipfs/" + response.data.Hash;
}
const getDataFromIpfs = async(url) =>{
    console.log("Getting data");
    const data = await axios.get(url);
    return data.data;
}
module.exports = {uploadData,getDataFromIpfs};