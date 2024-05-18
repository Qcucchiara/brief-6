CREATE TABLE `user` (
  `id` varchar(36) PRIMARY KEY,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `username` varchar(255),
  `image_name` varchar(255),
  `email` varchar(255),
  `password` varchar(255),
  `role` varchar(255),
  `is_active` bool,
  `activation_token` varchar(255),
  `gdpr_date` date,
  `created_at` date,
  `updated_at` date
);

CREATE TABLE `follow` (
  `fk_follower_id` varchar(255),
  `fk_followed_id` varchar(255),
  `active` bool,
  `created_at` date
);

CREATE TABLE `likes` (
  `fk_user_id` varchar(255),
  `fk_post_id` varchar(255),
  `created_at` date
);

CREATE TABLE `post` (
  `id` varchar(36) PRIMARY KEY,
  `user_id` varchar(255),
  `content` varchar(255),
  `like` integer,
  `created_at` date,
  `updated_at` date
);

CREATE TABLE `comments` (
  `id` varchar(36) PRIMARY KEY,
  `post_id` varchar(255),
  `user_id` varchar(255),
  `content` varchar(255),
  `like` integer,
  `created_at` date,
  `updated_at` date
);

ALTER TABLE `follow` ADD FOREIGN KEY (`fk_follower_id`) REFERENCES `user` (`id`);

ALTER TABLE `follow` ADD FOREIGN KEY (`fk_followed_id`) REFERENCES `user` (`id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `post` (`id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`fk_post_id`) REFERENCES `post` (`id`);
