const { Router } = require('express');
const router = new Router;

const Post = require(`../models/post_model`);
const User = require(`../models/user_model`);
const authenticateUser = require('../middleware/authenticate_user');
const { PrivacyOptionsEnum } = require('../utils/enums');

const {
  Posts,
  SelfPosts,
  FriendsPosts,
  UpdateStats
} = require('../utils/enums').APIPostPathsEndpointsEnum;


/** POST A NEW POST AND SET ITS AUTHOR AS THE CONNECTED AUTHENTICATED USER THAT SENT THE REQUEST **/
router.post(`/${Posts}`, authenticateUser, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.userFromAuth._id
    });

    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(400).send(e);
  }
});

/** GET ALL POSTS OF ALL USERS, REQUIRING TO BE A LOGGED IN AUTHENTICATED USER TO VIEW THIS - IT'S NOT SECURED ! **/
router.get(`/${Posts}`, /*authenticateUser,*/ async (req, res) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (e) {
    res.status(400).send(e);
  }
});

/** GET ALL POSTS OF THE SPECIFIC LOGGED IN AUTHENTICATED USER **/
router.get(`/${Posts}/${SelfPosts}`, authenticateUser, async (req, res) => {
  try {
    await req.userFromAuth.populate(Posts).execPopulate();
    res.send({user: req.userFromAuth, posts: req.userFromAuth.posts});
  } catch (e) {
    res.status(500).send(e);
  }
});

/** patch  POSTS stat **/
router.patch(`/${Posts}/${UpdateStats}/:id/:optionName/:stats`, authenticateUser, async (req, res) => {
  try {
    if(req.params.optionName == "likes"){
      const postStatUpdate = await Post.findByIdAndUpdate(req.params.id, {$inc : {"stats.likes" : 1}});
    }
    if(req.params.optionName == "comments"){
      const postStatUpdate = await Post.findByIdAndUpdate(req.params.id, {$inc : {"stats.comments" : 1}});
    }

    res.send({ postStatUpdate });
  } catch (e) {
    console.log(e);
    return res.status(500).send();
  }
});

/** GET ALL FRIENDS POSTS OF THE SPECIFIC LOGGED IN AUTHENTICATED USER **/
router.get(`/${Posts}/${FriendsPosts}`, authenticateUser, async (req, res) => {
  try {
    const allUsers = await User.find({});
    let allFriendsPosts = [];

    await req.userFromAuth.populate(Posts).execPopulate();
    if (req.userFromAuth.posts.length > 0) {
      allFriendsPosts = [ { user: req.userFromAuth, posts: req.userFromAuth.posts } ];
    }

    for (const user of allUsers) {
      if (user.friends.includes(req.userFromAuth._id)) {
        await user.populate(Posts).execPopulate();
        const posts = user.posts.filter((post) => post.privacy !== PrivacyOptionsEnum.Private);
        if (posts.length > 0) {
          allFriendsPosts = allFriendsPosts.concat( { user, posts } );
        }
      }
    }

    res.send(allFriendsPosts);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;