const { Post } = require('../../Models/post');
const client = require('../../Services/mongodb');
const { extractToken } = require('../../Utils/extractToken');
const { ObjectId } = require('mongodb');

const createPost = async (req, res) => {
  try {
    const user = await extractToken(req);

    const userId = user.userId;
    const content = req.body.content;

    if (!user || !content) {
      res.status(418).json('il manque un truc');
      return;
    }

    const newPost = new Post(
      userId,
      content,
      [],
      [],
      true,
      new Date(),
      new Date()
    );

    let result = await client
      .db('Brief-6')
      .collection('Post')
      .insertOne(newPost);

    res.status(201).json('posted');
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readPostsFromUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      let result = await client
        .db('Brief-6')
        .collection('Post')
        .find()
        .toArray();

      res.status(200).json({ result: result });
      return;
    }

    let result = await client
      .db('Brief-6')
      .collection('Post')
      .find({ userId: userId })
      .toArray();

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

// cette fonctionnalité ne sera pas intégré au back, mais directement au front avec un fetch allPost par follow.
// ça permettra, si c'est bien fait, de ne pas faire attendre l'utilisateur jusqu'à la fin de l'opération pour consulter le résultat.
const readFromFollow = async (req, res) => {
  try {
    // const userId = req.params.userId;
    // let result = await client
    //   .db('Brief-6')
    //   .collection('Follows')
    //   .findOne({ userId: userId });
    // const followList = result.followList;
    // console.log(followList);
    // let allPostFromFollows = [];
    // for (let i = 0; i < followList.length; i++) {
    //   const followerId = followList[i].followId;
    // }
    // res.status(200).json({ result: '' });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const updatePost = async (req, res) => {
  try {
    const user = await extractToken(req);
    const userId = user.userId;
    const postId = req.params.postId;
    const newContent = req.body.newContent;

    let result = await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        {
          _id: ObjectId.createFromHexString(postId),
          userId: userId,
        },
        {
          $set: { content: newContent },
        }
      );
    console.log(userId);
    console.log(result);

    res.status(201).json('post updated');
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const removePost = async (req, res) => {
  try {
    const user = await extractToken(req);
    const userId = user.userId;
    const postId = req.params.postId;

    let result = await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        {
          _id: ObjectId.createFromHexString(postId),
          userId: userId,
        },
        {
          $set: { visible: false },
        }
      );
    console.log(userId);
    console.log(result);

    res.status(201).json('post removed');
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = {
  createPost,
  readPostsFromUser,
  readFromFollow,
  updatePost,
  removePost,
};
