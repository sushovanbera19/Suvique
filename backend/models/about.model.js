import db from "../config/db.js";

export const getAboutPage = (lang) => {
  const sql = "SELECT * FROM about_page WHERE lang = ?";
  return db.promise().query(sql, [lang]);
};

export const getAboutPageFallback = () => {
  const sql = "SELECT * FROM about_page WHERE lang = 'en'";
  return db.promise().query(sql);
};

export const upsertAboutPage = (data, lang) => {
  const sql = `
    INSERT INTO about_page (
      lang, heading, description,
      stat1_value, stat1_label,
      stat2_value, stat2_label,
      stat3_value, stat3_label,
      experience_title, experience_text,
      feature1, feature2, feature3, feature4, feature5,
      hero_image, about_image, experience_image,
      video_banner_image, video_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      heading = VALUES(heading),
      description = VALUES(description),
      stat1_value = VALUES(stat1_value),
      stat1_label = VALUES(stat1_label),
      stat2_value = VALUES(stat2_value),
      stat2_label = VALUES(stat2_label),
      stat3_value = VALUES(stat3_value),
      stat3_label = VALUES(stat3_label),
      experience_title = VALUES(experience_title),
      experience_text = VALUES(experience_text),
      feature1 = VALUES(feature1),
      feature2 = VALUES(feature2),
      feature3 = VALUES(feature3),
      feature4 = VALUES(feature4),
      feature5 = VALUES(feature5),
      hero_image = VALUES(hero_image),
      about_image = VALUES(about_image),
      experience_image = VALUES(experience_image),
      video_banner_image = VALUES(video_banner_image),
      video_url = VALUES(video_url)
  `;
  const values = [
    lang,
    data.heading,
    data.description,
    data.stat1_value,
    data.stat1_label,
    data.stat2_value,
    data.stat2_label,
    data.stat3_value,
    data.stat3_label,
    data.experience_title,
    data.experience_text,
    data.feature1,
    data.feature2,
    data.feature3,
    data.feature4,
    data.feature5,
    data.hero_image || null,
    data.about_image || null,
    data.experience_image || null,
    data.video_banner_image || null,
    data.video_url || null,
  ];
  return db.promise().query(sql, values);
};
