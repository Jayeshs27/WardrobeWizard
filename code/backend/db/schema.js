import mongoose from "mongoose";
// 1st stop
const user = new mongoose.Schema({
    name:{type:String, required:true, trim:true},
    age:{type:Intl, required:true, trim:true},
})
/**
 * Assuming for now Name, Age, Email, About, Gender, Pronouns, mobile.
 */
const userProfileModel = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    mobile: {type: Number, required: true},
    gender: { type: String, enum: ['Male', 'Female', 'Other' ], required: true },

    // about: { type: String, required: true, trim: true },
    // pronouns: { type: String, required: true, trim: true },
    // age: { type: Number, required: true },
});

// module.exports = mongoose.model('UserProfileModel', UserProfileModel);

const userModel = mongoose.model("user", user);
const UserProfileModel = mongoose.model("userProfileModel", userProfileModel,"UserProfile");
export { userModel, UserProfileModel };