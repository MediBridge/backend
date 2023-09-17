const router = require("express").Router();
const {db} = require("../utils/Firebase");
const nearWallet = require('../utils/NearWallet');
router.get("/savepassword", async (req, res) => {
  try {
    const aTuringRef = db.collection('users').doc('aturing');

await aTuringRef.set({
  'first': 'Alan',
  'middle': 'Mathison',
  'last': 'Turing',
  'born': 1912
});
    return res.status(201).json({ msg: "Added person!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});


router.get("/savepassword", async (req, res) => {
  try {
    const aTuringRef = db.collection('users').doc('aturing');

await aTuringRef.set({
  'first': 'Alan',
  'middle': 'Mathison',
  'last': 'Turing',
  'born': 1912
});
    return res.status(201).json({ msg: "Added person!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
module.exports = router;
