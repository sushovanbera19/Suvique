import {
  getAllInspiredSections,
  getActiveInspiredSections,
  getInspiredSectionById,
  createInspiredSection,
  updateInspiredSection,
  deleteInspiredSection,
  toggleInspiredSection,
} from "../models/inspiredSection.model.js";

export const fetchAllSections = async (req, res) => {
  try {
    const sections = await getAllInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchActiveSections = async (req, res) => {
  try {
    const sections = await getActiveInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchSectionById = async (req, res) => {
  try {
    const section = await getInspiredSectionById(req.params.id);
    if (!section) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSection = async (req, res) => {
  try {
    const { heading, description, point1, point2, point3, button_text, button_link, sort_order, is_active } = req.body;
    if (!heading || !heading.trim()) {
      return res.status(400).json({ success: false, message: "Heading is required" });
    }
    const image = req.file ? `/uploads/inspired/${req.file.filename}` : null;
    await createInspiredSection({
      heading: heading.trim(),
      description: description || "",
      point1: point1 || "",
      point2: point2 || "",
      point3: point3 || "",
      button_text: button_text || "",
      button_link: button_link || "",
      image,
      sort_order: parseInt(sort_order) || 0,
      is_active: is_active !== undefined ? parseInt(is_active) : 1,
    });
    const sections = await getAllInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSection = async (req, res) => {
  try {
    const { heading, description, point1, point2, point3, button_text, button_link, sort_order, is_active } = req.body;
    const updateData = {};
    if (heading !== undefined) updateData.heading = heading.trim();
    if (description !== undefined) updateData.description = description;
    if (point1 !== undefined) updateData.point1 = point1;
    if (point2 !== undefined) updateData.point2 = point2;
    if (point3 !== undefined) updateData.point3 = point3;
    if (button_text !== undefined) updateData.button_text = button_text;
    if (button_link !== undefined) updateData.button_link = button_link;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);
    if (is_active !== undefined) updateData.is_active = parseInt(is_active);
    if (req.file) updateData.image = `/uploads/inspired/${req.file.filename}`;
    await updateInspiredSection(req.params.id, updateData);
    const sections = await getAllInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    await deleteInspiredSection(req.params.id);
    const sections = await getAllInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSection = async (req, res) => {
  try {
    const { is_active } = req.body;
    await toggleInspiredSection(req.params.id, parseInt(is_active));
    const sections = await getAllInspiredSections();
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
