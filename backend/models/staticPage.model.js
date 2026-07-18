import db from "../config/db.js";

export const getAllStaticPages = () => {
  return db.promise().query("SELECT id, slug, lang, updated_at FROM static_pages ORDER BY id");
};

export const getStaticPageBySlug = (slug, lang) => {
  return db.promise().query("SELECT * FROM static_pages WHERE slug = ? AND lang = ?", [slug, lang]);
};

export const getStaticPageBySlugFallback = (slug) => {
  return db.promise().query("SELECT * FROM static_pages WHERE slug = ? AND lang = 'en'", [slug]);
};

export const upsertStaticPage = (slug, data, lang) => {
  const sql = `
    INSERT INTO static_pages (
      slug, lang,
      hero_title, hero_subtitle, hero_image,
      section1_title, section1_text1, section1_text2, section1_image,
      section2_title, section2_text1, section2_text2, section2_image,
      features_title,
      feature1_title, feature1_desc, feature1_icon,
      feature2_title, feature2_desc, feature2_icon,
      feature3_title, feature3_desc, feature3_icon,
      feature4_title, feature4_desc, feature4_icon,
      stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label,
      cta_title, cta_text, cta_btn, cta_link,
      extra_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      hero_title = VALUES(hero_title), hero_subtitle = VALUES(hero_subtitle), hero_image = VALUES(hero_image),
      section1_title = VALUES(section1_title), section1_text1 = VALUES(section1_text1), section1_text2 = VALUES(section1_text2), section1_image = VALUES(section1_image),
      section2_title = VALUES(section2_title), section2_text1 = VALUES(section2_text1), section2_text2 = VALUES(section2_text2), section2_image = VALUES(section2_image),
      features_title = VALUES(features_title),
      feature1_title = VALUES(feature1_title), feature1_desc = VALUES(feature1_desc), feature1_icon = VALUES(feature1_icon),
      feature2_title = VALUES(feature2_title), feature2_desc = VALUES(feature2_desc), feature2_icon = VALUES(feature2_icon),
      feature3_title = VALUES(feature3_title), feature3_desc = VALUES(feature3_desc), feature3_icon = VALUES(feature3_icon),
      feature4_title = VALUES(feature4_title), feature4_desc = VALUES(feature4_desc), feature4_icon = VALUES(feature4_icon),
      stat1_value = VALUES(stat1_value), stat1_label = VALUES(stat1_label),
      stat2_value = VALUES(stat2_value), stat2_label = VALUES(stat2_label),
      stat3_value = VALUES(stat3_value), stat3_label = VALUES(stat3_label),
      cta_title = VALUES(cta_title), cta_text = VALUES(cta_text), cta_btn = VALUES(cta_btn), cta_link = VALUES(cta_link),
      extra_json = VALUES(extra_json)
  `;
  const values = [
    slug,
    lang,
    data.hero_title, data.hero_subtitle, data.hero_image,
    data.section1_title, data.section1_text1, data.section1_text2, data.section1_image,
    data.section2_title, data.section2_text1, data.section2_text2, data.section2_image,
    data.features_title,
    data.feature1_title, data.feature1_desc, data.feature1_icon,
    data.feature2_title, data.feature2_desc, data.feature2_icon,
    data.feature3_title, data.feature3_desc, data.feature3_icon,
    data.feature4_title, data.feature4_desc, data.feature4_icon,
    data.stat1_value, data.stat1_label,
    data.stat2_value, data.stat2_label,
    data.stat3_value, data.stat3_label,
    data.cta_title, data.cta_text, data.cta_btn, data.cta_link,
    data.extra_json ? JSON.stringify(data.extra_json) : null,
  ];
  return db.promise().query(sql, values);
};
