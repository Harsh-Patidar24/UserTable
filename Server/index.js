const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
console.log("hfudsf")
app.get('/', (req,res) => {
    // res.send("uishdei");
    
    res.write("iJ olleH");
    res.end();
})

// const delay = async(d=1) => {
//     const promised = new promises((resolve, reject) => {

//     })

// }

// app.use((err,req,res,next) => {
//     try{
//         console.log(req)
//     }
//     catch(err){
//         console.log("errr has occured", err);
//     }
// })

app.listen((3030), ()=>{
    console.log('server is running on port 3030',);
})





