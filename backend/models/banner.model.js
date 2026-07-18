import db from "../config/db.js";

export const getAllBanners = () => db.promise().query("SELECT * FROM banners ORDER BY sort_order ASC, id ASC");
export const getActiveBanners = () => db.promise().query("SELECT * FROM banners WHERE status = 'active' ORDER BY sort_order ASC, id ASC");
export const getBannerById = (id) => db.promise().query("SELECT * FROM banners WHERE id = ?", [id]);

export const createBanner = (data) => {
  const sql = "INSERT INTO banners (title, subtitle, image, link, sort_order, status) VALUES (?, ?, ?, ?, ?, ?)";
  return db.promise().query(sql, [data.title, data.subtitle, data.image, data.link, data.sort_order || 0, data.status || "active"]);
};

export const updateBanner = (id, data) => {
  const sql = "UPDATE banners SET title=?, subtitle=?, image=?, link=?, sort_order=?, status=? WHERE id=?";
  return db.promise().query(sql, [data.title, data.subtitle, data.image, data.link, data.sort_order, data.status, id]);
};

export const deleteBanner = (id) => db.promise().query("DELETE FROM banners WHERE id = ?", [id]);
