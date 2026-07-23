import {
  getSection, updateSection,
  getAllItems, getActiveItems, getItemById,
  createItem, updateItem, deleteItem,
} from "../models/instagramSection.model.js";

export const fetchSection = async (req, res) => {
  try {
    const section = await getSection();
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSectionCtrl = async (req, res) => {
  try {
    const { heading, instagram_url, button_text, overlay_text, is_active } = req.body;
    const updateData = {};
    if (heading !== undefined) updateData.heading = heading.trim();
    if (instagram_url !== undefined) updateData.instagram_url = instagram_url.trim();
    if (button_text !== undefined) updateData.button_text = button_text.trim();
    if (overlay_text !== undefined) updateData.overlay_text = overlay_text.trim();
    if (is_active !== undefined) updateData.is_active = parseInt(is_active);
    await updateSection(updateData);
    const section = await getSection();
    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchAllItems = async (req, res) => {
  try {
    const items = await getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchActiveItems = async (req, res) => {
  try {
    const section = await getSection();
    const items = await getActiveItems();
    res.json({ success: true, data: { section, items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createItemCtrl = async (req, res) => {
  try {
    const { alt_text, link, sort_order, is_active } = req.body;
    let image_url = req.body.image_url || "";
    if (req.file) {
      image_url = `/uploads/instagram/${req.file.filename}`;
    }
    if (!image_url) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    await createItem({
      image_url,
      alt_text: alt_text || "",
      link: link || "",
      sort_order: parseInt(sort_order) || 0,
      is_active: is_active !== undefined ? parseInt(is_active) : 1,
    });
    const items = await getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItemCtrl = async (req, res) => {
  try {
    const { alt_text, link, sort_order, is_active, image_url } = req.body;
    const updateData = {};
    if (alt_text !== undefined) updateData.alt_text = alt_text;
    if (link !== undefined) updateData.link = link;
    if (sort_order !== undefined) updateData.sort_order = parseInt(sort_order);
    if (is_active !== undefined) updateData.is_active = parseInt(is_active);
    if (req.file) updateData.image_url = `/uploads/instagram/${req.file.filename}`;
    else if (image_url !== undefined) updateData.image_url = image_url;
    await updateItem(req.params.id, updateData);
    const items = await getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItemCtrl = async (req, res) => {
  try {
    await deleteItem(req.params.id);
    const items = await getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
