const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
    //check if user is login
    if (req.session.userAuth) {
        next();
    } else {
        // next(appErr("Not Authorized, Login"));
        res.render('users/notAuthorize')
    }
}

module.exports = protected;