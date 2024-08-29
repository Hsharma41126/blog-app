const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const { registerCtlr, loginCtrl, userDetailsCtrl, profileCtrl, profilePhotoCtrl, coverPhotoCtrl, passwordCtrl, userUpdateCtrl, logoutCtrl } = require('../../controllers/users/userControler');
const protected = require('../../middlewares/protected');
const userRoutes = express.Router();

//Instance of Multer
const upload = multer({ storage })

userRoutes.get('/login', (req, res) => {
    res.render('users/login', { error: "" });
})

userRoutes.get('/register', (req, res) => {
    res.render('users/register', { error: "" });
})

// userRoutes.get('/profile-page', (req, res) => {
//     res.render('users/profile');
// })

// userRoutes.get('/update-user-form', (req, res) => {
//     res.render('users/updateUser');
// })

userRoutes.get('/update-user-password', (req, res) => {
    res.render('users/updatePassword', { error: '' });
})


userRoutes.get('/profile-photo-upload', (req, res) => {
    res.render('users/uploadProfilePhoto', { error: "" });
})

userRoutes.get('/upload-cover-photo', (req, res) => {
    res.render('users/uploadCoverPhoto', { error: "" });
})

//Post/register
userRoutes.post('/register', registerCtlr);

//Post/login
userRoutes.post('/login', loginCtrl);


//Get/profile/:id
userRoutes.get('/profile-page', protected, profileCtrl);

//Put/profile-photo-upload/:id
userRoutes.put('/profile-photo-upload', protected, upload.single('profile'), profilePhotoCtrl);

//Put/cover-photo-upload/:id
userRoutes.put('/cover-photo-upload', protected, upload.single('coverImg'), coverPhotoCtrl);

//Put/update-password/:id
userRoutes.put('/update-password', passwordCtrl);

//Put/update/:id
userRoutes.put('/update', userUpdateCtrl);

userRoutes.get('/logout', logoutCtrl);
//Get/:id
userRoutes.get('/:id', userDetailsCtrl);
//Get/logout

module.exports = userRoutes;