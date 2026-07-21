ALTER TABLE `invitations`
  ADD COLUMN `couple_scene_image` VARCHAR(191) NULL,
  ADD COLUMN `couple_scene_image_key` VARCHAR(191) NULL,
  ADD COLUMN `livestream_url` VARCHAR(2048) NULL,
  ADD COLUMN `dress_code` JSON NULL;
