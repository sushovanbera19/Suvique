import { getAllUISettings, getUISettingsByType, upsertManyUISettings, resetUISettingsByType } from "../models/uiSettingsModel.js";

const buildStructured = (rows) => {
  const result = {};
  rows.forEach((r) => {
    if (!result[r.component_type]) result[r.component_type] = {};
    if (!result[r.component_type][r.component_name]) result[r.component_type][r.component_name] = {};
    result[r.component_type][r.component_name][r.setting_key] = r.setting_value;
  });
  return result;
};

export const fetchAllUISettings = async (req, res) => {
  try {
    const rows = await getAllUISettings();
    res.json({ success: true, data: buildStructured(rows), flat: rows });
  } catch (err) {
    console.error("Fetch UI settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch UI settings" });
  }
};

export const fetchUISettingsByType = async (req, res) => {
  try {
    const rows = await getUISettingsByType(req.params.type);
    res.json({ success: true, data: buildStructured(rows) });
  } catch (err) {
    console.error("Fetch UI settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch UI settings" });
  }
};

export const saveUISettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || !Array.isArray(settings) || !settings.length) {
      return res.status(400).json({ success: false, message: "No settings provided" });
    }
    await upsertManyUISettings(settings);
    res.json({ success: true, message: "UI settings saved" });
  } catch (err) {
    console.error("Save UI settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to save UI settings" });
  }
};

export const resetUISettings = async (req, res) => {
  try {
    await resetUISettingsByType(req.params.type);
    res.json({ success: true, message: `Reset ${req.params.type} settings` });
  } catch (err) {
    console.error("Reset UI settings error:", err.message);
    res.status(500).json({ success: false, message: "Failed to reset" });
  }
};
