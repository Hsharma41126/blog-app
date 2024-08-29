const bcrypt = require('bcrypt');
const User = require('../../models/user/User');
const appErr = require('../../utils/appErr');


const registerCtlr = async (req, res, next) => {
    const { fullname, email, password } = req.body;

    //check if the field is empty
    if (!fullname || !email || !password) {
        // return next(appErr("All Fields are required"))
        return res.render('users/register', {
            error: "All Fields are required"
        })
    }
    try {
        //user already exist in db (email)
        const userFound = await User.findOne({ email });
        //throw an error
        if (userFound) {
            // return next(appErr("User Already Exist"))
            return res.render('users/register', {
                error: "User Already Exist"
            })
            // return res.json({ status: "failed", data: "User Already Exist" })
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        //register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed
        })
        // res.json({
        //     status: "Success",
        //     user: user
        // });
        //redirecting
        res.redirect('/api/v1/users/profile-page');

    } catch (error) {
        res.json(error);
    }
}

const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        // return next(appErr("email and password filed are required"))
        return res.render('users/login', {
            error: "Invalid login Credentials"
        })
    }
    try {
        //check the email exist
        const userFound = await User.findOne({ email });
        if (!userFound) {
            //throw error
            // return next(appErr("Invalid login credentials"))
            return res.render('users/login', {
                error: "Invalid login Credentials"
            })
            // if (userFound) {
            // return res.json({ status: "failed", data: "Invalid login credentials" });
            // }
        }
        const isPasswordValid = await bcrypt.compare(password, userFound.password);
        if (!isPasswordValid) {
            if (userFound) {
                // return next(appErr("Invalid login credentials"))
                // return res.json({ status: "failed", data: "Invalid login credentials" })
                return res.render('users/login', {
                    error: "Invalid login Credentials"
                })
            }
        }

        //save the user into session

        req.session.userAuth = userFound._id;

        // console.log(req.session);

        // res.json({
        //     status: "Success",
        //     data: userFound
        // });
        res.redirect('/api/v1/users/profile-page');
    } catch (error) {
        res.json(error);
    }
}

const userDetailsCtrl = async (req, res) => {
    try {
        //get user id from params
        const userID = req.params.id;
        const user = await User.findById(userID);

        // res.json({
        //     status: "Success",
        //     user: user
        // });
        res.render('users/updateUser', {
            user,
            error: ''
        })
    } catch (error) {
        // res.json(error);
        res.render('users/updateUser', {
            error: error.message
        })
    }
}

const profileCtrl = async (req, res) => {
    try {
        //get login user
        const userId = req.session.userAuth;
        const user = await User.findById(userId).populate('posts').populate('comment');
        // res.json({
        //     status: "Success",
        //     data: user
        // });
        res.render('users/profile', { user })
    } catch (error) {
        res.json(error);
    }
}

const profilePhotoCtrl = async (req, res, next) => {
    // console.log(req.file.path);
    try {
        //check  if the file exist
        if (!req.file) {
            // return next(appErr('Please Upload Image', 403));
            return res.render('users/uploadProfilePhoto', { error: 'Please Upload Image', });
        }

        //find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);

        //if user is not found
        if (!userFound) {
            return res.render('users/uploadProfilePhoto', { error: 'User Not Found', });
        };
        //update user profile photo
        const userUpdated = await User.findByIdAndUpdate(userID, {
            profileImage: req.file.path,
        },
            {
                new: true,
            }
        );
        // res.json({
        //     status: "Success",
        //     user: "User has successfully Upload the  Profile Image ",
        //     data: user,
        // });
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        // return next(appErr(error.message))
        return res.render('users/uploadProfilePhoto', { error: error.message });
    }
}

const coverPhotoCtrl = async (req, res) => {
    // console.log(req.file.path);
    try {

        if (!req.file) {
            // return next(appErr('Please Upload Image', 403));
            return res.render('users/uploadCoverPhoto', { error: 'Please Upload Image', });
        }

        //find the user to be updated
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        //if user is not found
        if (!userFound) {
            return res.render('users/uploadCoverPhoto', { error: 'User Not Found', });
        };
        //update user profile photo
        const userUpdated = await User.findByIdAndUpdate(userID, {
            coverImage: req.file.path,
        },
            {
                new: true,
            }
        );
        // res.json({
        //     status: "Success",
        //     user: "User has successfully Upload the Cover Image ",
        //     data: userUpdated,
        // });
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/uploadCoverPhoto', { error: error.message });
    }
}

const passwordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try {
        // check if the user is updating password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
            await User.findByIdAndUpdate(
                // req.params.id,
                req.session.userAuth,
                {
                    password: passwordHashed,
                },
                {
                    new: true
                }
            );
        }
        //update user


        // res.json({
        //     status: "Success",
        //     user: "User Password updated"
        // });
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/updatePassword', { error: error.message });

    }
}

const userUpdateCtrl = async (req, res, next) => {
    const { fullname, email } = req.body;

    try {

        if (!fullname || !email) {
            return res.render('users/updateUser', {
                error: 'Please Provide details',
                user: '',
            });
        }

        //check if the email is not taken
        if (email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                // return next('Email is Taken', 400)
                return res.render('users/updateUser', {
                    error: 'Email is Taken',
                    user: '',
                });
            };
        }
        const user = await User.findByIdAndUpdate(
            // req.params.id,
            req.session.userAuth,
            {
                fullname,
                email
            }, {
            new: true
        }
        )
        // res.json({
        //     status: "Success",
        //     data: user
        // });
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        return res.render('users/updateUser', { error: error.message, user: '' });
    }
}

const logoutCtrl = async (req, res) => {
    try {
        // res.json({
        //     status: "Success",
        //     user: "User Logout"
        // });
        //destroy session
        req.session.destroy(() => {
            res.redirect('/api/v1/users/login');
        })
    } catch (error) {
        res.json(error);
    }
}



module.exports = { registerCtlr, loginCtrl, userDetailsCtrl, profileCtrl, profilePhotoCtrl, coverPhotoCtrl, passwordCtrl, userUpdateCtrl, logoutCtrl };