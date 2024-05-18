const express = require('express');
const {
  createPost,
  removePost,
  readPostsFromUser,
  updatePost,
  readFromFollow,
} = require('../Controllers/Post/Post');
const {
  likePost,
  dislikePost,
  unlikePost,
} = require('../Controllers/Post/PostLikes');
const {
  addComment,
  readCommentsFromPost,
  editComment,
  deleteComment,
} = require('../Controllers/Post/PostComments');
const { followUser, unfollowUser } = require('../Controllers/User/UserFollows');

const router = express.Router();

// TODO: modifier son profile

// créer un post
router.route('/post/add').post(createPost);
router.route('/post/readall/:userId').get(readPostsFromUser);
router.route('/post/update/:postId').patch(updatePost);
router.route('/post/remove/:postId').patch(removePost);

// liker un post
router.route('/post/like/:postId').patch(likePost);
router.route('/post/dislike/:postId').patch(dislikePost);
router.route('/post/unlike/:postId').patch(unlikePost);

// commenter un post
router.route('/post/addcomment/:postId').patch(addComment);
router.route('/post/readcomments/:postId').get(readCommentsFromPost); // cette ligne était inutile. //
router.route('/post/editcomment/:postId').patch(editComment);
router.route('/post/deletecomment/:postId').patch(deleteComment);

// follow un utillisateur
router.route('/follow/add/:followedId').patch(followUser);
router.route('/follow/remove/:followedId').patch(unfollowUser);

// TODO: rechercher des comptes utilisateurs par adresse email ou username.

// TODO: voir les post de ses follows. ==> a retirer et implémenter dans le front
router.route('/post/readfollows/:userId').get(readFromFollow);

// NIVEAU 2
// TODO: suggestion de follows par popularité (?)

// NIVEAU 3
// TODO: notifications (nouveaux follows, commentaires, likes ...)
// TODO: régler les paramètres de notifications
// TODO: paramètres de confidentialités pour modifier la visibilité du contenu et de leurs informations.
// TODO: supprimer son profile et toute ses activités

module.exports = router;
