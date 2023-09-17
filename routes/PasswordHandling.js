const router = require("express").Router();
const { db } = require("../utils/Firebase");
const nearWallet = require("../utils/NearWallet");
router.post("/sharepassword", async (req, res) => {
  try {
    const { userId, email,password } = req.body;
    if (!userId || !email || !password)
      return res
        .status(404)
        .json({ msg: "Missing paramaters in body of request" });

    const userCollectionRef = db.collection("users").doc(userId);
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

router.get("/savepassword", async (req, res) => {
  try {
    const aTuringRef = db.collection("users").doc("aturing");

    await aTuringRef.set({
      first: "Alan",
      middle: "Mathison",
      last: "Turing",
      born: 1912,
    });
    return res.status(201).json({ msg: "Added person!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
module.exports = router;
