const express = require("express");
const { signup, signin,signout } = require("../controllers/auth");
const { userSignupValidator } = require("../validators/index");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

// any route containing :userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;