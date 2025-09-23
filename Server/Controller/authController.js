const AuthUser = require("../models/AuthUser")

// for register

exports.register = async(req, res) => {
    const{email, password} = req.body;
    if(!email || !password) {
        return res.status(400).send("Email And Password Are Required")
    }
    try {
        const newUser = new AuthUser({email, password});
        await newUser.save();
        res.json({msg: "User Regiastered Sucessfully"});
    }
    catch(err){
        console.error("Got error while regisstering", err);
        res.status(500).send("Error has occured");
    }
};


// fro Login

exports.login = async(req,res) => {
    const {email, password} = req.body;
    try{
        const user = await AuthUser.findOne({email});
        if(!user) return res.status(400).send("User Not Found");
        if(user.password !== password) return res.status(400).send("Invalid Password");
        res.json({msg: "User login Sucessfully"});
    }
    catch(err){
        console.error("error", err);
        res.json({msg:"Error Has Occured While Login"});
    }
};

// for logout 
exports.logout = (req, res) => {
  // Optional: handle session/token invalidation
  res.json({ msg: "User Logged Out Successfully" });
};