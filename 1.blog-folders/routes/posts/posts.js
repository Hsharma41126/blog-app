const express = require('express');
const multer = require('multer');
const storage = require('../../config/cloudinary');

const { postsCtrl, showPostCtrl, postDetailCtrl, postDeleteCtrl, postUpdateCtrl } = require('../../controllers/posts/postsController');

const postRoutes = express.Router();
const protected = require('../../middlewares/protected');


//instance of multer
const upload = multer({
    storage
})

//Post
postRoutes.post('/', protected, upload.single('file'), postsCtrl);

//Get
postRoutes.get('/', showPostCtrl);

//Get/:id
postRoutes.get('/:id', postDetailCtrl);

//DELETE/:id
postRoutes.delete('/:id', protected, postDeleteCtrl);

//PUT/:id
postRoutes.put('/:id', postUpdateCtrl);


module.exports = postRoutes;