import { getAllShowrooms, getActiveShowrooms, getShowroomById, createShowroom, updateShowroom, deleteShowroom, bulkDeleteShowrooms } from "../models/showroom.model.js";

export const fetchAllShowrooms = async (req, res) => {
  try {
    const showrooms = await getAllShowrooms();
    res.json({ success: true, data: showrooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchActiveShowrooms = async (req, res) => {
  try {
    const showrooms = await getActiveShowrooms();
    res.json({ success: true, data: showrooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchShowroomById = async (req, res) => {
  try {
    const showroom = await getShowroomById(req.params.id);
    if (!showroom) return res.status(404).json({ success: false, message: "Showroom not found" });
    res.json({ success: true, data: showroom });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createShowroomCtrl = async (req, res) => {
  try {
    const { name, address, city, phone, image, latitude, longitude, status } = req.body;
    if (!name || !address || !city) {
      return res.status(400).json({ success: false, message: "Name, address, and city are required" });
    }
    const result = await createShowroom({ name, address, city, phone, image, latitude, longitude, status });
    res.status(201).json({ success: true, message: "Showroom created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateShowroomCtrl = async (req, res) => {
  try {
    const { name, address, city, phone, image, latitude, longitude, status } = req.body;
    await updateShowroom(req.params.id, { name, address, city, phone, image, latitude, longitude, status });
    res.json({ success: true, message: "Showroom updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteShowroomCtrl = async (req, res) => {
  try {
    await deleteShowroom(req.params.id);
    res.json({ success: true, message: "Showroom deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bulkDeleteShowroomsCtrl = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.status(400).json({ success: false, message: "No IDs provided" });
    await bulkDeleteShowrooms(ids);
    res.json({ success: true, message: `${ids.length} showrooms deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
