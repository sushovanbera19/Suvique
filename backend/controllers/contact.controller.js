import {
  getAllContacts,
  getContactById,
  getContactsByStatus,
  insertContact,
  updateContactStatus,
  deleteContact,
  bulkDeleteContacts,
  getContactStats,
} from "../models/contact.model.js";

export const fetchAllContacts = async (req, res) => {
  try {
    const [rows] = await getAllContacts();
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchContactById = async (req, res) => {
  try {
    const [rows] = await getContactById(req.params.id);
    if (rows.length === 0) return res.json({ success: false, message: "Contact not found" });
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchContactsByStatus = async (req, res) => {
  try {
    const [rows] = await getContactsByStatus(req.params.status);
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createContact = async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.json({ success: false, message: "Name, email and message are required" });
  }
  try {
    await insertContact({ name, email, message });
    return res.json({ success: true, message: "Contact saved successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await updateContactStatus(req.params.id, req.body.status);
    return res.json({ success: true, message: "Status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeContact = async (req, res) => {
  try {
    await deleteContact(req.params.id);
    return res.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkRemoveContacts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) return res.json({ success: false, message: "No IDs provided" });
    await bulkDeleteContacts([ids]);
    return res.json({ success: true, message: "Contacts deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchContactStats = async (req, res) => {
  try {
    const [total, unread, read, replied, archived] = await getContactStats();
    return res.json({
      success: true,
      data: {
        total: total[0][0].total,
        unread: unread[0][0].count,
        read: read[0][0].count,
        replied: replied[0][0].count,
        archived: archived[0][0].count,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
