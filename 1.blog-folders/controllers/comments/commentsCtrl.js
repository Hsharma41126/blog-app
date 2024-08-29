const Post = require('../../models/post/Post');
const User = require('../../models/user/User');
const Comment = require('../../models/comment/Comment');
const appErr = require('../../utils/appErr');


const commentCtrl = async (req, res) => {
    const { message } = req.body;
    try {
        //find the post 
        const post = await Post.findById(req.params.id);
        // create comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
        });
        //push the comment to  post
        post.comment.push(comment._id);
        //find the user
        const user = await User.findById(req.session.userAuth);
        //push comment into user
        user.comment.push(comment._id);
        //disable validation
        //save
        await post.save({ validateBeforeSave: false })
        await user.save({ validateBeforeSave: false })
        res.json({
            status: "Success",
            data: comment
        });
    } catch (error) {
        res.json(error);
    }
}

const DetailsCtrl = async (req, res) => {
    try {
        res.json({
            status: "Success",
            user: "Comments Details"
        });
    } catch (error) {
        res.json(error);
    }
}

const commentDeleteCtrl = async (req, res, next) => {
    try {
        //find the comment 
        const comment = await Comment.findById(req.params.id);
        //check if the post belongs to the user
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this comment', 403))
        }
        // delete post
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
            status: "Success",
            user: "Comment Deleted successfully"
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}

const updateCtrl = async (req, res, next) => {
    const { message } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(appErr('Comment Not Found'))
        }
        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this comment', 403))
        }
        //update post
        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, {
            message,
        }, {
            new: true
        })
        res.json({
            status: "Success",
            user: commentUpdated
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}


module.exports = {
    commentCtrl,
    DetailsCtrl,
    commentDeleteCtrl,
    updateCtrl

}