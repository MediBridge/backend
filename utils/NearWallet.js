const nearAPI = require("near-api-js");
const { connect } = nearAPI;
const { Contract } = nearAPI;

// creates keyStore from a provided file
// you will need to pass the location of the .json key pair

const { KeyPair, keyStores } = require("near-api-js");
const fs = require("fs");
const homedir = require("os").homedir();

const ACCOUNT_ID = "near-example.testnet"; // NEAR account tied to the keyPair
const NETWORK_ID = "testnet";
// path to your custom keyPair location (ex. function access key for example account)
const KEY_PATH = "/.near-credentials/testnet/kinosxz.testnet.json";

const credentials = JSON.parse(fs.readFileSync(homedir + KEY_PATH));
const myKeyStore = new keyStores.InMemoryKeyStore();
myKeyStore.setKey(
  NETWORK_ID,
  ACCOUNT_ID,
  KeyPair.fromString(credentials.private_key)
);
const CONTRACT_NAME = process.env.CONTRACT_NAME;
const createConfiguration = async () => {
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

  return contract;
};

