const express = require('express');
const { DetailsCtrl, commentDeleteCtrl, updateCtrl, commentCtrl } = require('../../controllers/comments/commentsCtrl');
const protected = require('../../middlewares/protected');
const commentRoutes = express.Router();


//Post
commentRoutes.post('/:id', protected, commentCtrl);


// //Get////////
// commentRoutes.get('', async (req, res) => {
//     try {
//         res.json({
//             status: "Success",
//             user: "Comments List"
//         });
//     } catch (error) {
//         res.json(error);
//     }
// });
////////////////////////////

//Get/:id
commentRoutes.get('/:id', DetailsCtrl);

//DELETE/:id
commentRoutes.delete('/:id', protected, commentDeleteCtrl);

//PUT/:id
commentRoutes.put('/:id', protected, updateCtrl);

module.exports = commentRoutes;