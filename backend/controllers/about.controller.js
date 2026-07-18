import { getAboutPage, getAboutPageFallback, upsertAboutPage } from "../models/about.model.js";

// GET about page content
export const fetchAboutPage = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    let [rows] = await getAboutPage(lang);

    if (rows.length === 0) {
      [rows] = await getAboutPageFallback();
    }

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: "No about page content found",
      });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update about page content
export const updateAboutPage = async (req, res) => {
  try {
    const lang = req.query.lang || req.body.lang || 'en';
    const {
      heading,
      description,
      stat1_value,
      stat1_label,
      stat2_value,
      stat2_label,
      stat3_value,
      stat3_label,
      experience_title,
      experience_text,
      feature1,
      feature2,
      feature3,
      feature4,
      feature5,
      hero_image,
      about_image,
      experience_image,
      video_banner_image,
      video_url,
    } = req.body;

    if (!heading || !description) {
      return res.json({
        success: false,
        message: "Heading and description are required",
      });
    }

    await upsertAboutPage({
      heading,
      description,
      stat1_value,
      stat1_label,
      stat2_value,
      stat2_label,
      stat3_value,
      stat3_label,
      experience_title,
      experience_text,
      feature1,
      feature2,
      feature3,
      feature4,
      feature5,
      hero_image,
      about_image,
      experience_image,
      video_banner_image,
      video_url,
    }, lang);

    return res.json({
      success: true,
      message: "About page updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
