ALTER TABLE about_page
  ADD COLUMN hero_image VARCHAR(255) DEFAULT NULL AFTER feature5,
  ADD COLUMN about_image VARCHAR(255) DEFAULT NULL AFTER hero_image,
  ADD COLUMN experience_image VARCHAR(255) DEFAULT NULL AFTER about_image,
  ADD COLUMN video_banner_image VARCHAR(255) DEFAULT NULL AFTER experience_image,
  ADD COLUMN video_url VARCHAR(500) DEFAULT NULL AFTER video_banner_image;
