const client = require('../../Services/mongodb');
const { extractToken } = require('../../Utils/extractToken');
const { ObjectId } = require('mongodb');

// TODO: liker un post
const addComment = async (req, res) => {
  try {
    const user = await extractToken(req);
    const speakTo = req.body.speakTo;
    const postId = req.params.postId;
    const content = req.body.content;

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $addToSet: {
            comments: {
              commentId: new ObjectId(),
              userId: user.userId,
              // respondTo: speakTo,
              content: content,
            },
          },
        }
      );
    console.log(result);

    res.status(200).json({ result: `comment added` });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const readCommentsFromPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .findOne({ _id: ObjectId.createFromHexString(postId) });

    if (result.visible !== true) {
      res.status(400).json({ error: 'post already deleted' });
      return;
    }
    res.status(200).json({ result: result.comments });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const editComment = async (req, res) => {
  try {
    // const user = await extractToken(req);
    const postId = req.params.postId;
    const commentId = req.body.commentId;
    const newContent = req.body.newContent;

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .findOne({ _id: ObjectId.createFromHexString(postId) });

    if (!result) {
      res.status(400).json({ error: 'unexpected error' });
      return;
    }
    const currentListComments = result.comments;
    let newListOfComments = [];

    currentListComments.forEach((comment) => {
      if (comment.commentId + '' !== commentId) {
        newListOfComments.push(comment);
      } else {
        comment.content = newContent;
        newListOfComments.push(comment);
      }
    });
    console.log(newListOfComments);

    await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $set: { comments: newListOfComments },
        }
      );

    res.status(200).json({
      result: `comment modified`,
    });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const deleteComment = async (req, res) => {
  try {
    // const user = await extractToken(req);
    const postId = req.params.postId;
    const commentId = req.body.commentId;
    const newContent = req.body.newContent;

    const result = await client
      .db('Brief-6')
      .collection('Post')
      .findOne({ _id: ObjectId.createFromHexString(postId) });

    if (!result) {
      res.status(400).json({ error: 'unexpected error' });
      return;
    }
    const currentListComments = result.comments;
    let newListOfComments = [];

    currentListComments.forEach((comment) => {
      if (comment.commentId + '' !== commentId) {
        newListOfComments.push(comment);
      }
    });
    console.log(newListOfComments);

    await client
      .db('Brief-6')
      .collection('Post')
      .updateOne(
        { _id: ObjectId.createFromHexString(postId) },
        {
          $set: { comments: newListOfComments },
        }
      );
    res
      .status(200)
      .json({ result: `comment deleted to post with ${req.params.postId} id` });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = {
  addComment,
  readCommentsFromPost,
  editComment,
  deleteComment,
};
