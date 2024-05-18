class Post {
  constructor(userId, content, comments, likes, visible, createdAt, updatedAt) {
    this.userId = userId;
    this.content = content;
    this.comments = comments;
    this.likes = likes;
    this.visible = visible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = { Post };
