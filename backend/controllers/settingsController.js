import {
  getAllSettings,
  getSettingsByGroup,
  upsertManySettings,
} from "../models/settingsModel.js";

// GET /api/settings — returns all settings as { key: value } grouped by group
export const fetchAllSettings = async (req, res) => {
  try {
    const rows = await getAllSettings();

    const grouped = {};
    const flat = {};

    rows.forEach((row) => {
      if (!grouped[row.setting_group]) grouped[row.setting_group] = {};
      grouped[row.setting_group][row.setting_key] = row.setting_value;
      flat[row.setting_key] = row.setting_value;
    });

    res.json({ success: true, data: { grouped, flat } });
  } catch (err) {
    console.error("Fetch settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
};

// GET /api/settings/:group — returns settings for a specific group
export const fetchSettingsByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    const rows = await getSettingsByGroup(group);

    const flat = {};
    rows.forEach((row) => {
      flat[row.setting_key] = row.setting_value;
    });

    res.json({ success: true, data: flat });
  } catch (err) {
    console.error("Fetch settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
};

// POST /api/settings — bulk save settings: { settings: [{ key, value, group }] }
export const saveSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || !Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({ success: false, message: "No settings provided" });
    }

    await upsertManySettings(settings);

    res.json({ success: true, message: "Settings saved successfully" });
  } catch (err) {
    console.error("Save settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to save settings" });
  }
};
