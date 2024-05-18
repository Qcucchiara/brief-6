const client = require('../../Services/mongodb');
const { extractToken } = require('../../Utils/extractToken');
const { ObjectId } = require('mongodb');

// TODO: liker un post
const likePost = async (req, res) => {
  try {
    const user = await extractToken(req);
    const postId = req.params.postId;

    await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $pull: {
            likes: { userId: user.userId },
          },
        }
      );

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $addToSet: {
            likes: {
              userId: user.userId,
              likeIsUp: true,
            },
          },
        }
      );
    console.log(result);

    res.status(200).json({ result: 'post liked' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const dislikePost = async (req, res) => {
  try {
    const user = await extractToken(req);
    const postId = req.params.postId;

    await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $pull: {
            likes: { userId: user.userId },
          },
        }
      );

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $addToSet: {
            likes: {
              userId: user.userId,
              likeIsUp: false,
            },
          },
        }
      );
    res.status(200).json({ result: 'post disliked' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const unlikePost = async (req, res) => {
  try {
    const user = await extractToken(req);
    const postId = req.params.postId;

    await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $pull: {
            likes: { userId: user.userId },
          },
        }
      );
    res.status(200).json({ result: 'post unliked' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = { likePost, dislikePost, unlikePost };
