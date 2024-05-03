// import userModel from "./schema.js";
// import UserProfileModel from "./schema.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel, UserProfileModel  } from "./schema.js";
import { execFile } from 'child_process';
import { join } from 'path';


const JWT_SECRET = 'UjJ4abN9HrCFVg7zMN2RdI6Txq5FOvSnEu8y3oYf0WDLcXilB1PKQwepZGmAhktSNh5XmDW3pF7QwU2zbgR0Kl8';

function validateEmail(emailStr) {
    let atIndex = emailStr.indexOf("@");
    if (atIndex !== -1) {
        let dotIndex = emailStr.indexOf(".", atIndex);
        if (dotIndex !== -1 && dotIndex > atIndex) {
            return true;
        }
    }

    return false;
}

class userControl {
    static getAllDoc = async(req, res) => {
        try {
            const result = await userModel.find()
            res.send(result)
        }
        catch(err) {
            console.log(err)
        }
    }
    static addUser = async(req, res) => {
        try {
           const newUser = new userModel(req.body)
           const savedUser = await newUser.save();
           res.send(savedUser)
        }
        catch(err) {
            console.log(err)
        }
    }
}

class UserProfileControl {
    static async getAllUsers(req, res) {
        try {
            const result = await UserProfileModel.find();
            res.send(result);
        } catch (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
        }
    }

    static async addUser(req, res) {
        try {
            console.log(req.body);
            const { name, email, password, confirmPassword, mobile, gender } = req.body;

            if (!email.trim()) {
                return res.json({ success: false, message: "Email is a required field" });
            }

            if (!validateEmail(email)) {
                return res.json({ success: false, message: "Enter a valid email"})
            }

            if (!password.trim()) {
                return res.json({ success: false, message: "Password is a required field" });
            }

            if (password !== confirmPassword) {
                return res.json({ success: false, message: "Password and Confirm Password do not match" });
            }

            if (!mobile.trim() || isNaN(parseInt(mobile)) || mobile.length !== 10) {
                return res.json({ success: false, message: "Invalid phone number" });
            }

            const existingUser = await UserProfileModel.findOne({ email });
            if (existingUser) {
                return res.json({ success: false, message: 'User already exists' });
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new UserProfileModel({ name, email:email.toLowerCase(), password: hashPassword, mobile, gender });
            await newUser.save();

            return res.json({ success: true, message: 'User added successfully' });
        } catch (err) {
            console.log(err);
            return res.status(500).send(err);
        }
    }

    static async checkUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email.trim() || !password.trim()) {
                return res.json({ success: false, message: "Email and Password are required fields" });
            }

            const existingUser = await UserProfileModel.findOne({ email });
            if (!existingUser) {
                return res.json({ success: false, message: 'Email not registered' });
            }

            if (await bcrypt.compare(password, existingUser.password)) {
                const token = jwt.sign({ email: existingUser.email }, JWT_SECRET);
                return res.json({ success: true, message: 'Login successful', data: token });
            } else {
                return res.json({ success: false, message: 'Incorrect password' });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).send("Internal Server Error");
        }
    }

    static async UpdateProfile(req, res) {
        console.log(req.body)
        try {
            const { name, mobile, email, gender } = req.body;

            if (!email.trim()) {
                return res.json({ success: false, message: "Email is a required field" });
            }
            if (!mobile.trim() || isNaN(parseInt(mobile)) || mobile.length !== 10) {
                return res.json({ success: false, message: "Invalid phone number" });
            }
            
            const currUser = await UserProfileModel.findOne({ email });
            if (!currUser) {
                return res.json({ success: false, message: 'User not found' });
            }

            const updateUser = await UserProfileModel.findOneAndUpdate(
                { email },
                { name, mobile, gender },
                { new: true }
            );

            console.log(`User updated successfully :`);
            console.log(`Prev User : ${currUser}`)
            console.log(`Update User : ${updateUser}`)

            return res.json({ success: true, message: "Profile updated successfully" });    
        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    static async UpdatePassword(req, res) {
        console.log(req.body)
        try {
            const { email, oldPassword, newPassword, confirmPassword } = req.body;

            if(!oldPassword.trim()){
                return res.json({ success: false, message: "old password is a required field" });
            }
            if(!newPassword.trim()){
                return res.json({ success: false, message: "new password is a required field" });
            }
            if(!confirmPassword.trim()){
                return res.json({ success: false, message: "confirm password is a required field" });
            }
            if(newPassword !== confirmPassword){
                return res.json({ success: false, message: "confirm password and new password are different" });
            }
            
            const currUser = await UserProfileModel.findOne({ email });
            
            if(!(await bcrypt.compare(oldPassword, currUser.password))){
                return res.json({ success: false, message: "incorrect old password"});
            }
            const hashPassword = await bcrypt.hash(newPassword, 10);
            const updateUser = await UserProfileModel.findOneAndUpdate(
                { email },
                { password: hashPassword},
                { new: true }
            ); 

            console.log('Password updated successfully');
            console.log(`Updated User : ${updateUser}`)
            return res.json({ success: true, message: "Password updated successfully" });    
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: err.message });
        }
    }

    static async DeleteAccount(req, res){
        console.log(req.body);
        try {
            const { email } = req.body;

            const result = await UserProfileModel.deleteOne({ email });
            console.log(result);
            
            if(result.deletedCount > 0){
                console.log('Account Deleted successfully');
                return res.json({ success: true, message: "Account Deleted successfully" });    
            }
            return res.json({ success: false, message: "Error while deleting account" });    

        } catch (err) {
            console.log(err)
            return res.status(500).json({ success: false, message: err.message });
        }
    }
}

function getRecommendations (req, res) {
    console.log(req.body)
    const userInp = req.body['input']
    const clothes = req.body['clothes']

    const pythonScriptPath = 'randomGen.py'
    let inp = clothes.map(item => [item.id, item.Tags[0], item.Tags[1], item.Tags[2], item.ImageSrc]).flat();
    inp.push(userInp)
    console.log(inp)
    execFile('python3', [pythonScriptPath, ...inp], (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            return res.status(500).json({ success: false, message: 'Error running Python script' });
        }
        const lines = stdout.trim().split('\n');
        const top = lines[0]
        const bottom = lines[1]
        return res.json({ success: true, top: top, bottom: bottom});
    })
}
export { userControl as userControl, UserProfileControl as UserProfileControl, getRecommendations as getRecommendations };

// export default userControl

// async function getAllStudent(){
//     try {
//       const users = await axios.get("http://192.168.191.1:8000/api/login")
//       console.log(users.data)
//       // setUsers(users.data)
//     }
//     catch (error) {
//       console.log(error)
//     }
//   }
