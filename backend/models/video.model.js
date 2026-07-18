import db from "../config/db.js";

export const getAllVideos = () => db.promise().query("SELECT * FROM videos ORDER BY sort_order ASC, id ASC");
export const getActiveVideos = () => db.promise().query("SELECT * FROM videos WHERE status = 'active' ORDER BY sort_order ASC, id ASC");
export const getVideoById = (id) => db.promise().query("SELECT * FROM videos WHERE id = ?", [id]);

export const createVideo = (data) => {
  const sql = "INSERT INTO videos (title, video_url, thumbnail, sort_order, status) VALUES (?, ?, ?, ?, ?)";
  return db.promise().query(sql, [data.title, data.video_url, data.thumbnail, data.sort_order || 0, data.status || "active"]);
};

export const updateVideo = (id, data) => {
  const sql = "UPDATE videos SET title=?, video_url=?, thumbnail=?, sort_order=?, status=? WHERE id=?";
  return db.promise().query(sql, [data.title, data.video_url, data.thumbnail, data.sort_order, data.status, id]);
};

export const deleteVideo = (id) => db.promise().query("DELETE FROM videos WHERE id = ?", [id]);
