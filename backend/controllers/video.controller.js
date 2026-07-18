import { getAllVideos, getActiveVideos, createVideo, updateVideo, deleteVideo } from "../models/video.model.js";

export const fetchAllVideos = async (req, res) => {
  try {
    const [rows] = await getAllVideos();
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const fetchActiveVideos = async (req, res) => {
  try {
    const [rows] = await getActiveVideos();
    res.json({ success: true, data: rows });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const createVideoCtrl = async (req, res) => {
  try {
    const { title, video_url, thumbnail, sort_order, status } = req.body;
    if (!video_url) return res.status(400).json({ success: false, message: "Video URL is required" });
    const [result] = await createVideo({ title, video_url, thumbnail, sort_order, status });
    res.status(201).json({ success: true, message: "Video created", id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const updateVideoCtrl = async (req, res) => {
  try {
    const { title, video_url, thumbnail, sort_order, status } = req.body;
    await updateVideo(req.params.id, { title, video_url, thumbnail, sort_order, status });
    res.json({ success: true, message: "Video updated" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

export const deleteVideoCtrl = async (req, res) => {
  try {
    await deleteVideo(req.params.id);
    res.json({ success: true, message: "Video deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
