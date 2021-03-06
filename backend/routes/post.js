const express = require("express");
const { getPosts, createPost, postsByUser,
    postById, isPoster,
    deletePost, updatePost,
    getSinglePost, photo, like, unlike } = require("../controllers/post");

const { createPostValidator } = require("../validators/index");
const { requireSignin } = require('../controllers/auth');
const { userById } = require("../controllers/user");

const router = express.Router();

// post routes
router.get('/posts', getPosts);

//like unlike
router.put("/post/like", requireSignin, like);
router.put("/post/unlike", requireSignin, unlike);

router.get('/post/:postId', getSinglePost);
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);
router.get('/posts/by/:userId', requireSignin, postsByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// photo
router.get("/post/photo/:postId", photo);


// any route containing :userId, our app will first execute userById()
router.param("userId", userById);
// any route containing :postId, our app will first execute postById()
router.param('postId', postById);


module.exports = router;
