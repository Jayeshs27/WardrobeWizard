import express from "express";
import { userControl, UserProfileControl, getRecommendations } from "../db/operations.js";
import wardrobe from "../db/wardrobe_operations.js";
import multer from 'multer'

const router = express.Router();

router.get('/user', userControl.getAllDoc)
router.post('/user', userControl.addUser)

router.post('/signup', UserProfileControl.addUser);
router.post('/signin', UserProfileControl.checkUser);
router.post('/profile-update', UserProfileControl.UpdateProfile);
router.post('/password-update', UserProfileControl.UpdatePassword);
router.post('/delete-account', UserProfileControl.DeleteAccount);


router.get('/get-all-items', wardrobe.getAllItems)
router.post('/delete-item',wardrobe.deleteItem);
router.post('/toggle-like-option',wardrobe.toggleLikeOption)

router.post('/recommend', getRecommendations)


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './../uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now();
//       cb(null, uniqueSuffix + file.originalname)
//     },
// });
  
// const upload = multer({ storage: storage })

// router.post("/upload-item", upload.single("image"), async (req, res) => {
//     console.log(req.body);
//     try {
//         wardrobe.addItem(req, res);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Internal Server Error");
//     }
// });

// router.get('/signup', UserProfileControl.getAllUsers);
// module.exports = router;


export default router;
