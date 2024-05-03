import mongoose from "mongoose";
import fs from 'fs';
// import axios from 'axios'
import {ip,port} from '../global.js'
import { execFile } from 'child_process';
import { join } from 'path';
// import axios from 'axios';

const categories = ['Casualwear', 'Ethnic', 'Partywear', 'Sportwear', 'Traditional'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange'];
const clothTypes = ['T-shirt', 'Pant', 'Shirt', 'Saree', 'Dress', 'Jeans', 'Skirt', 'Jacket', 'Shorts'];

function generateRandomTags() {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomClothType = clothTypes[Math.floor(Math.random() * clothTypes.length)];

  return [randomCategory, randomColor, randomClothType];
}


const ImageDetailsSchema = new mongoose.Schema({
  Path: { type: String, required: true, trim: true },
  Tags: { type: Array, required: true, trim: true },
  isFav: { type: Boolean, required: true, trim: true }
});

const Images = mongoose.model("ImageDetails", ImageDetailsSchema, "ImageDetails");


// function sendImage() {
//   var filePath = 'uploads/1710528238750test.jpeg'

//   var formData = new FormData();
//   formData.append('file', filePath);

//   fetch(`http://10.42.0.229:5001/ml-uploads`, {
//       method: 'POST',
//       body: formData
//   })
//   .then(response => console.log(response))
//   .then(data => {
//       console.log(data);
//   })
//   .catch(error => {
//       console.error('Error:', error);
//   });
// }


class wardrobe {
  static addItem = async (req, res) => {
    try {
      console.log(req.body);
      const currentUser = JSON.parse(req.body.currentUser);
      const imagePath = req.file.path;

      // const currentDirectory = process.cwd();
      // const newPath = currentDirectory.replace(/\/backend$/, '');
      // const modelsPath = join(newPath, 'models');

      // console.log(modelsPath);

      // process.chdir(modelsPath)

      const pythonScriptPath = 'classify.py' 
      
      console.log(imagePath)
      execFile('python3', [pythonScriptPath, imagePath], (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing Python script:', error);
          return res.status(500).json({ success: false, message: 'Error running Python script' });
        }
        // console.log(typeof(stdout));
        const lines = stdout.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        
        // Extract the tags from the last line
        const tags = lastLine.split(', ');
        
        // Extract the values from the tags and create a list
        const tagValues = tags.map(tag => tag.split(': ')[1].replace(/['{} ]/g, ''));
        console.log(tagValues); // Output: ['Coat', 'gray']
        // res.json({ success: true, message: stdout });
        const Tags = tagValues;
  
        const UserCollection = mongoose.model(`UserWardrobe`, ImageDetailsSchema, `${currentUser.email}`);
  
        const newItem = new UserCollection({ Path: imagePath, Tags: Tags, isFav: false });
        newItem.save()
          .then(response => {
            console.log(`Item Uploaded successfully : ${response.Path}`)
            res.json({ success: true, message: 'Item Uploaded successfully!' });
          })
          .catch(err => {
            console.error('Error saving item:', err);
            res.status(500).json({ success: false, message: 'Error saving item' });
          })
        });
      // const Tags = JSON.parse(req.body.Tags);
    }
    catch (e) {
      console.log(e);
    }
  }

  static deleteItem = async (req, res) => {
    try {

      const Itemid = req.body.item.id;
      const currentUser = req.body.currentUser;
      const UserCollection = mongoose.model(`UserWardrobe`, ImageDetailsSchema, `${currentUser.email}`);
      const response = await UserCollection.deleteOne({ _id: Itemid });
      if (response.deletedCount === 1) {
        const url = req.body.item.ImageSrc;

        const parts = url.split("/");
        const relativePath = parts.slice(3).join('/');

        fs.unlink(relativePath, (err) => {
          if (err) {
            console.log(err);
            res.json({ success: false, message: "object removed for DB but not from local storage" })
          }
          else {
            res.json({ success: true, message: "object removed successfully" });
          }
        })
      }
      else {
        res.json({ success: false, message: "object not found" });
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  static getAllItems = async (req, res) => {

    const UserCollection = mongoose.model(`UserWardrobe`, ImageDetailsSchema, `${req.query.currentUser.email}`);
    try {
      const result = await UserCollection.find({})
      res.send(result)
    }
    catch (e) {
      console.log(e);
    }
  }


  static toggleLikeOption = async (req, res) => {
    try {
      const itemId = req.body.item.id;
      const prevValue = !req.body.item.isFav;
      const currentUser = req.body.currentUser;
      console.log(currentUser.email);
      const UserCollection = mongoose.model(`UserWardrobe`, ImageDetailsSchema, `${currentUser.email}`);
      const response = await UserCollection.updateOne(
        { _id: itemId },
        { $set: { isFav: prevValue } }
      )
      console.log(response);
      if (response.modifiedCount) {
        res.json({ success: true, message: "toggled like button successfully" });
      }
      else {
        res.json({ success: false, message: "Error while updating like option" });
      }
    }
    catch (e) {
      console.log(e);
    }
  }

}


// app.post("/upload-image", upload.single("image"), async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
//     // const imageName = "image_filename";

//     // try {
//     //   await Images.create({image:imageName})
//     //   res.json({status:"ok"});
//     // } catch (error) {
//     //   res.json({status: error});
//     // }

//     // res.send("Uploaded!!!");
//   });

//   app.get("get-image", async (req, res) => {
//     try {
//       Images.find({}).then((data) => {
//         res.send({ status: "ok", data: data });
//       });
//     } catch (error) {
//       res.json({ status: error });
//     }
//   });


export default wardrobe;


// const realPath = `http://${ip}:${port}/` + imagePath;
// const image = fs.readFileSync(imagePath);
// // const response = fetch(realPath)

// const formData = new FormData();

// //   formData.append("image", {j
// //     uri: response.blob(),
// //     type: 'image/jpeg',
// //     name: 'test.jpeg',
// //  });
// const blob = new Blob([image], { type: 'image/jpeg' });
// formData.append('image', blob, 'test.jpeg');
// const result = await axios.post(
//   `http://10.42.0.229:5001/upload-item`,
//   formData,
//   {
//       headers: { "Content-Type": "multipart/form-data" }
//   }
// );
// console.log(result);
// // const realPath = `http://${ip}:${port}/` + imagePath;
// fetch(realPath)
// .then(response => response.blob())
// .then(blob => {
//     // Create FormData objectrs
//     var formData = new FormData();
//     formData.append('image', blob, 'test.jpeg');

//     // Send FormData to server
//     fetch('http://10.42.0.229:5001/upload-item', {
//         method: 'POST',
//         formData,
//         headers:{ "Content-Type": "multipart/form-data" }
//     })
//     .then(response => response.text())
//     .then(data => {
//         // alert(data);
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// })
// .catch(error => {
//     console.error('Error fetching image:', error);
// });

//
// const response = await fetch(imagePath);
// var formData = new FormData();

// formData.append('image',response.blob(), 'test.png');

// formData.append("currentUser", JSON.stringify(response.data.data));
// const result = await axios.post(
//     `http://10.42.0.229:5001/ml-upload-item`,
//     formData,
//     {
//         headers: { "Content-Type": "multipart/form-data" }
//     }
// );
//

// sendImage();
