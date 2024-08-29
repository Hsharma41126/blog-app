const User = require('../../models/user/User');
const Post = require('../../models/post/Post');
const appErr = require('../../utils/appErr');

const postsCtrl = async (req, res, next) => {
    const { title, description, category, image, user } = req.body;
    try {
        if (!title || !description || !category || req.file) {
            return next(appErr("All Field are Required"))
        };
        //find the user
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //create the post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: userFound._id,
            image: req.file.path,
        })

        userFound.posts.push(postCreated._id);
        await userFound.save();
        res.json({
            status: "Success",
            data: postCreated
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}

const showPostCtrl = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('comment');

        res.json({
            status: "Success",
            data: posts
        });
    } catch (error) {
        return next(appErr(error.message))
    }
}

//fetch the single post
const postDetailCtrl = async (req, res, next) => {
    try {
        //get the id from params
        const id = req.params.id;
        //using populate we can see the full object insteaed of single id
        const post = await Post.findById(id).populate('comment');


        res.json({
            status: "Success",
            user: post,
        });
    } catch (error) {
        next(appErr(error.message))
    }
}

const postDeleteCtrl = async (req, res, next) => {
    try {
        //find the post 
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to delete this post', 403))
        }
        // delete post
        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: "Success",
            data: "Post has been Deleted successfully"
        });
    } catch (error) {
        next(appErr(error.message))
    }
}

const postUpdateCtrl = async (req, res, next) => {
    const { title, description, category } = req.body
    try {

        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr('You are not allowed to update this post', 403))
        }
        //update post
        const postUpdated = await Post.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            image: req.file.path,
        }, {
            new: true
        })
        res.json({
            status: "Success",
            data: postUpdated
        });
    } catch (error) {
        res.json(error);
    }
}


module.exports = {
    postsCtrl,
    showPostCtrl,
    postDetailCtrl,
    postDeleteCtrl,
    postUpdateCtrl
};