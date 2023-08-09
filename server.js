const express = require('express');
const app = express();
const port = 3003;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticatejwt = require('./middlewares/authenticatejwt');
const Owner = require('./models/Owner');
const Shops = require('./models/Shops');
const User = require('./models/User');
require('dotenv').config();

// Middleware to parse JSON requests
app.use(express.json());

// environment variable for jwt authentication
let Secret_Key = process.env.SECRET_KEY;

//Database Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "shop_app" });


//Routes
// Route to handle registration of shop owners
app.post("/shopowners/register",(req,res)=>{
    let {username,password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    Owner.findOne({username}).then((owner)=>{
    if(owner){
        return res.status(400).json({ message: "Owner Already Exists" });
    }    
    try{
       let owner = new Owner({username,password});
       owner.save();
       res.status(200).json({message:"New ShopOwner Created Successfully"});
    }
    catch(e){
        res.status(500).json({ message: "Error creating shop owner" });
    }
    })
})

// Route to handle shop owner login
app.post("/shopowners/login",(req,res)=>{
      let {username,password} = req.body;
      Owner.findOne({username,password}).then((owner)=>{
      if(owner){
       let token = jwt.sign({id:owner._id,role:"owner"},Secret_Key,{expiresIn:'1h'});
      res.status(200).json({"success": true,
        "message": "Login successful",
        "token": `${token}`})
      }
    else{
     res.status(401).json({message:"Invalid username or password"});
    }
    })
})

// Route to create a new shop (accessible only to shop owners)
app.post("/createShop",authenticatejwt,async (req,res)=>{
    if(req.role=="owner"){
        try{
        let shop = new Shops(req.body);
        await shop.save();
        await Owner.findByIdAndUpdate(req.id,{shop:shop._id})
        res.status(200).json({message:"New Shop Opened Successfully",id:shop._id})
        }
        catch(e){
            res.status(500).json({ message: "Error opening new shop" });
        }
    }
    else{
        res.status(401).json({message:"Not an Owner Account"});
    }
})

// Route to edit shop's details (accessible only to the shop owner of that shop)
app.put("/editShop/:id", authenticatejwt, async (req, res) => {
    if (req.role === "owner") {
        let shopid = req.params.id;
        try {
            const owner = await Owner.findOne({ _id: req.id });
            if (owner.shop == shopid) {
                await Shops.findByIdAndUpdate(shopid, req.body, { new: true });
                res.status(200).json({ message: "Shop edited Successfully" });
            } else {
                res.status(401).json({ message: "Unauthorized" });
            }
        } catch (e) {
            res.status(500).json({ message: "Error editing shop" });
        }
    } else {
        res.status(401).json({ message: "Not an Owner Account" });
    }
});

// Route to delete a shop (accessible only to the shop owner of that shop)
app.delete("/deleteShop/:id",authenticatejwt,(req,res)=>{
    if(req.role==="owner"){
    let shopid = req.params.id;
    Owner.findOne({_id:req.id}).then(async (owner)=>{
     if(owner.shop==shopid){
        try {
            await Shops.findByIdAndDelete(shopid);
            await Owner.findByIdAndUpdate(req.id, { shop: null });
            res.status(200).json({ message: "Shop Deleted Successfully" });
        } catch (e) {
            res.status(500).json({ message: "Error deleting shop" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
} else {
res.status(401).json({ message: "Not an Owner Account" });
}
});

// Route to handle user registration
app.post("/user/register",(req,res)=>{
    let {username,password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    User.findOne({username}).then((user)=>{
    if(user){
        return res.json({message:"User Already Exists"});
    }    
    try{
       let user = new User({username,password});
       user.save();
       res.status(200).json({message:"User Created Successfully"});
    }
    catch(e){
        res.sendStatus();
    }
    })
})

// Route to handle user login
app.post("/user/login",(req,res)=>{
      let {username,password} = req.body;
      User.findOne({username,password}).then((user)=>{
      if(user){
       let token = jwt.sign({username,role:"user"},Secret_Key,{expiresIn:'1h'});
      res.status(200).json({"success": true,
  "message": "Login successful",
  "token": `${token}`})
      }
    else{
     res.status(401).json({message:"Invalid username or password"});
    }
    })
})

// Route to search for shops by category
app.get("/shops/search/:category",authenticatejwt,async(req,res)=>{
    try{
    let shops = await Shops.find({shopCategory:req.params.category}).populate();
    res.status(200).json({shops})
    }
    catch(e){
        res.status(404).json({message:"Not Found"})
    }
})

// Route to get nearby shops based on user's location with basic approximation
app.get("/shops", authenticatejwt, async (req, res) => {
    try {
      const userLat = parseFloat(req.query.lat);   // Latitude of the user's location
      const userLong = parseFloat(req.query.long); // Longitude of the user's location
  
      const maxDifference = 0.01; // Approximate 
  
      const allShops = await Shops.find();
      const nearbyShops = [];
  
      // Checking proximity for each shop
      for (const shop of allShops) {
        const shopLat = parseFloat(shop.address.lat);
        const shopLong = parseFloat(shop.address.long);
  
        const latDiff = Math.abs(shopLat - userLat);
        const longDiff = Math.abs(shopLong - userLong);
  
        if (latDiff <= maxDifference && longDiff <= maxDifference) {
          nearbyShops.push(shop);
        }
      }
      res.status(200).json({ nearbyShops });
    } catch (error) {
      res.status(404).json({ message: `${error}` });
    }
  });

// Start the server
app.listen(port,()=>{console.log(`Server running on port ${port}`)});