class FollowTable {
  constructor(userId, followList) {
    this.userId = userId;
    this.followList = followList;
  }
}

class Follow {
  constructor(followId) {
    this.followId = followId;
    this.createdAt = new Date();
  }
}

module.exports = { FollowTable, Follow };
