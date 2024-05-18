const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { pool } = require('../../Services/mysql');
const { extractToken } = require('../../Utils/extractToken');
const { FollowTable, Follow } = require('../../Models/follow');
const client = require('../../Services/mongodb');
const { ObjectId } = require('mongodb');

async function createFollowTable(req, userId) {
  try {
    const newTable = new FollowTable(userId, []);

    let result = await client
      .db('Brief-6')
      .collection('Follows')
      .insertOne(newTable);
    // console.log(result);
    return 'table created';
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
}

const followUser = async (req, res) => {
  try {
    const followedId = req.params.followedId;
    const follower = await extractToken(req);
    const newFollow = new Follow(followedId);

    const post = await client
      .db('Brief-6')
      .collection('Follows')
      .findOne({ _id: ObjectId.createFromHexString(follower.tableFollowId) });

    const listeFollow = post.followList;

    // le return ne bloque pas un foreach
    for (let i = 0; i < listeFollow.length; i++) {
      const element = listeFollow[i];
      if (element.followId === followedId) {
        res.status(208).json({ result: 'already followed' });
        return;
      }
    }

    const result = await client
      .db('Brief-6')
      .collection('Follows')
      .updateOne(
        { _id: ObjectId.createFromHexString(follower.tableFollowId) },
        {
          $addToSet: {
            followList: newFollow,
          },
        }
      );

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followedId = req.params.followedId;
    const follower = await extractToken(req);
    const newFollow = new Follow(followedId);

    const post = await client
      .db('Brief-6')
      .collection('Follows')
      .findOne({ _id: ObjectId.createFromHexString(follower.tableFollowId) });

    const currentListFollow = post.followList;
    let newListFollow = [];

    currentListFollow.forEach((follow) => {
      if (follow.followId !== followedId) {
        newListFollow.push(follow);
      }
    });

    const result = await client
      .db('Brief-6')
      .collection('Follows')
      .updateOne(
        { _id: ObjectId.createFromHexString(follower.tableFollowId) },
        {
          $set: {
            followList: newListFollow,
          },
        }
      );

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.stack });
    console.log(error.stack);
  }
};

module.exports = { createFollowTable, followUser, unfollowUser };
