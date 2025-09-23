const UserTable = require("../models/UserTable")

exports.getAllUsers = async(req, res) => {
    try{
        const users = await UserTable.find();
        res.json(users);
    }
    catch(err){
        res.status(500).send("Error While Fetching All User");
    }
};

// Get user by id

exports.getUserById = async(req,res) => {
    try{
        const user = await UserTable.findById(req.params.id);
        if(!user) return res.status(400).send("User Not Found");
        res.json(user);
    }
    catch(err) {
        res.status(500).send("Error Has Occured While Fetching The User");
    }
};

// create New User 

exports.createUser = async(req,res) => {
    const{name, lastName, age} = req.body;

    if(!name || !lastName || !age) return res.status(400).send("All Fields are required");
    // console.log(req.body);
    try{
        const newUser = new UserTable({name, lastName, age: Number(age)});
        await newUser.save();
        res.json({msg: "New User has created Sucessfully", user: newUser});
    }
    catch(err){
        console.error("err", err)
        res.status(500).send("Error Has Occured While Creating The User ",err)
    }
};

// update the user 

exports.updateUser = async(req,res) => {
    try{
        const updateUser = await UserTable.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!updateUser) return res.status(404).send("User Not Found");
        res.json({msg: "User has updated Sucessfully", user: updateUser});
    }
    catch(err){
        res.status(500).send("Error While Updating the User");
    }
};

// Delete User 

exports.deleteUser = async(req,res) => {
    try{
        await UserTable.findByIdAndDelete(req.params.id);
        res.json({msg: "User Deleted Sucessfully"});
    }
    catch(err){
        res.status(500).send("Error Has Occured While Deleting", err);
    }
}