CREATE TABLE `user` (
  `id` varchar(36) PRIMARY KEY,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `username` varchar(255),
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
  `fk_follower_id` varchar(36),
  `fk_followed_id` varchar(36),
  `active` bool,
  `created_at` date
);

ALTER TABLE `follow` ADD FOREIGN KEY (`fk_follower_id`) REFERENCES `user` (`id`);

ALTER TABLE `follow` ADD FOREIGN KEY (`fk_followed_id`) REFERENCES `user` (`id`);
