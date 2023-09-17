const router = require("express").Router();
const { Contract, connect } = require("near-api-js");
const { db } = require("../utils/Firebase");
const {myKeyStore} = require("../utils/NearWallet");

const CONTRACT_NAME = process.env.CONTRACT_NAME;

router.post("/sharepassword", async (req, res) => {
  try {
    const { userAddress, email,password } = req.body;
    if (!userAddress || !email || !password )
      return res
        .status(404)
        .json({ msg: "Missing paramaters in body of request" });

    const userCollectionRef = db.collection("users").doc(userAddress);
    const data =  (await userCollectionRef.get()).data();
    console.log(data);
    if(data){
      const confidantees = data.confidantees;
      confidantees.push(email);
      console.log(confidantees);
      userCollectionRef.set(
        {
          password:data.password,
          confidantees
        }
      )
    }
    else{
      userCollectionRef.set(
        {
          password:password,
          confidantees:[email]
        }
      )
    }
    return res.status(201).json({ msg: "Added person!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

router.post("/fetchinformation", async (req, res) => {
  try {

    const {userEmail,accountAddress} = req.body;
    if(!userEmail || !accountAddress)
    return res.status(404).json({msg:"Missing parameters in request body"});

    const connectionConfig = {
      networkId: "testnet",
      keyStore: myKeyStore, // first create a key store
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await connect(connectionConfig);
    const account = await nearConnection.account("kinosxz.testnet");
    const contract = new Contract(
      account, // the account object that is connecting
      CONTRACT_NAME,
      {
        // name of contract you're connecting to
        viewMethods: ["get_patient_workaround"], // view methods do not change state but usually return a value
      //   changeMethods: ["addMessage"], // change methods modify state
      }
    );
    const userINFO = await contract.get_patient_workaround(
      {
        account_id:accountAddress
      }
    );
    console.log(accountAddress);
    const userCollectionRef = db.collection("users").doc(accountAddress);
    const data =  (await userCollectionRef.get()).data();

    if(!data)
    return res.status(404).json({msg:"No such patient exists"});
  const confidantees = data.confidantees;
  if(confidantees.includes(userEmail)){
    return res.status(200).json({userINFO});
  }
  else{
    return res.status(404).json({msg:"No access"});
  }

  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
module.exports = router;
