import express from 'express'
import mongoose from 'mongoose';
import connectDB from './db/connectDB.js';
import wardrobe from './db/wardrobe_operations.js'
// const cors = require('cors')
import web from './routes/routes.js'
import multer from 'multer'
import { ip,port } from './global.js'

import jwt from 'jsonwebtoken';
const JWT_SECRET = 'UjJ4abN9HrCFVg7zMN2RdI6Txq5FOvSnEu8y3oYf0WDLcXilB1PKQwepZGmAhktSNh5XmDW3pF7QwU2zbgR0Kl8';

const app = express()

const DATABASE_URL = process.env.DATABASE_URL || "mongodb+srv://jayeshsutar123456:jayesh123456@cluster0.oekezcl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

connectDB(DATABASE_URL);

app.use(express.json())

app.use((req, res, next) => {
  const origin = req.headers.origin
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use("", web);
app.use(express.urlencoded({ extended: false}));
app.use(express.static('.'))



const userSchema = new mongoose.Schema({
  id: String,
  password: String
});


const User = mongoose.model('User', userSchema, 'Log_In');

const userProfileSchema = new mongoose.Schema({
  id: String,
  password: String
});


const UserProfile = mongoose.model('UserProfile', userProfileSchema, 'UserProfile');


// app.post('/api/login', async (req, res) => {
//   console.log(req.body);
//   const { id, password } = req.body;
//   try {
//     const user = await User.findOne({ id, password });
//     if (user) {
//       console.log("Is user!!!!!!!!!!!!!!!!!!!");
//       res.json({ success: true, message: 'Login successful!' });
//     } else {
//       console.log("Is NOT user!!!!!!!!!!!!!!!!!!!");
//       res.json({ success: false, message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     console.log("It is a LOGIN ERROR!!!!!!!!!!!!!!!!!!!");
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
//   return res;
// });

// app.post('/api/signup', async (req, res) => {
//   const { name,email,mobile,password,confirmpassword } = req.body;
//   try {
//     const existingUser = await User.findOne({ email:email });
//     if (existingUser) {
//       console.log("User ALREADY exists !!!!!!!!!")
//       res.status(400).json({ success: false, message: 'User already exists' });
//     } else {
//       console.log("User CREATED succesfully !!!!!!!!!")
//       const newUser = new User({ id, password });
//       await newUser.save();
//       res.json({ success: true, message: 'User created successfully' });
//     }
//   } catch (error) {
//     console.log("It is a SIGNUP ERROR !!!!!!!!!!!!!!")
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

app.listen(port, () => {
    console.log(`Server listening at http://${ip}:${port}`)
})


const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname)
      },
});


// let ip2 = "69.69.69.69"
// function callFlaskServer(){
//     axios.post(`http://${ip2}:8585/predict`, { filePath })
//     .then(response => {
//       console.log('Response from Flask server:', response.data);
//     })
//     .catch(error => {
//       console.error('Error calling Flask server:', error);
//     });
// }

const upload = multer({ storage: storage })

app.post("/upload-image", upload.single("image"), async (req, res) => {
    try {
      wardrobe.addItem(req, res);
    }
    catch (err) {
      console.log(err);
    }
});

app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    // console.log(useremail); // Log the user's email
    UserProfile.findOne({ email: useremail }).then((data) => {
      // console.log(data); // Log the retrieved data
      return res.send({ status: "Ok", data: data });
    });
  } catch (error) {
    return res.send({ error: error });
  }
});

// app.get("/get-all-items", async (req, res) => {
//   try {
//       const result = wardrobe.getAllItems(req, res);
//       // console.log(result);
//       return result;
//   } catch (err) {
//       console.log(err);
//   }
// });
