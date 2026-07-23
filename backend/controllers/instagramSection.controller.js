import {
  getSection, updateSection,
  getAllItems, getActiveItems,
  createItem, bulkCreateItems, updateItem, deleteItem, deleteAllItems,
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
    const { heading, instagram_url, instagram_username, button_text, overlay_text, is_active } = req.body;
    const updateData = {};
    if (heading !== undefined) updateData.heading = heading.trim();
    if (instagram_url !== undefined) updateData.instagram_url = instagram_url.trim();
    if (instagram_username !== undefined) updateData.instagram_username = username_fix(instagram_username);
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

function username_fix(val) {
  return (val || "").replace("@", "").trim();
}

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

// Fetch from Instagram oEmbed (best-effort) or accept manual image URLs
export const fetchFromInstagram = async (req, res) => {
  try {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, message: "Provide an array of Instagram post URLs" });
    }

    const results = [];
    const errors = [];

    for (const url of urls) {
      const trimmed = url.trim();
      if (!trimmed) continue;

      // Try oEmbed first (works if FB access token is configured)
      try {
        const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(trimmed)}&omitscript=true`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(oembedUrl, {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          const text = await response.text();
          if (text && text.startsWith("{")) {
            const data = JSON.parse(text);
            if (data.thumbnail_url) {
              results.push({
                image_url: data.thumbnail_url,
                alt_text: data.title || data.author_name || "",
                link: trimmed,
              });
              continue;
            }
          }
        }
      } catch {}

      // oEmbed failed — return the URL so admin can add image manually
      errors.push({
        url: trimmed,
        error: "oEmbed unavailable. Paste the image URL manually.",
        needs_image: true,
      });
    }

    res.json({
      success: true,
      data: { fetched: results, errors, total: results.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save items (from oEmbed or manual)
export const saveFetchedItems = async (req, res) => {
  try {
    const { items, clearFirst } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items to save" });
    }
    if (clearFirst) await deleteAllItems();
    await bulkCreateItems(items);
    const allItems = await getAllItems();
    res.json({ success: true, data: allItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add single item (image URL + post link)
export const addItem = async (req, res) => {
  try {
    const { image_url, alt_text, link, sort_order, is_active } = req.body;
    if (!image_url || !image_url.trim()) {
      return res.status(400).json({ success: false, message: "Image URL is required" });
    }
    await createItem({
      image_url: image_url.trim(),
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

export const toggleItem = async (req, res) => {
  try {
    const { is_active } = req.body;
    await updateItem(req.params.id, { is_active: parseInt(is_active) });
    const items = await getAllItems();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderItem = async (req, res) => {
  try {
    const { sort_order } = req.body;
    await updateItem(req.params.id, { sort_order: parseInt(sort_order) });
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

export const clearAllItems = async (req, res) => {
  try {
    await deleteAllItems();
    res.json({ success: true, data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
