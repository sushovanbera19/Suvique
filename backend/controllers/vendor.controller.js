import { getAllVendors, getActiveVendors, getVendorById, createVendor, updateVendor, toggleVendorStatus, deleteVendor, bulkDeleteVendors } from "../models/vendor.model.js";

// Get all vendors (admin)
export const fetchAllVendors = async (req, res) => {
  try {
    const vendors = await getAllVendors();
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get active vendors (client)
export const fetchActiveVendors = async (req, res) => {
  try {
    const vendors = await getActiveVendors();
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get vendor by ID
export const fetchVendorById = async (req, res) => {
  try {
    const vendor = await getVendorById(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json({ success: true, data: vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create vendor
export const addVendor = async (req, res) => {
  try {
    const { name, website, description, status, sort_order } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, message: "Vendor name is required" });

    let logo = null;
    if (req.file) {
      logo = `/uploads/vendors/${req.file.filename}`;
    }

    const result = await createVendor({ name: name.trim(), logo, website, description, status, sort_order });
    res.status(201).json({ success: true, message: "Vendor created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update vendor
export const editVendor = async (req, res) => {
  try {
    const { name, website, description, status, sort_order } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (website !== undefined) updateData.website = website;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    if (req.file) {
      updateData.logo = `/uploads/vendors/${req.file.filename}`;
    }

    const result = await updateVendor(req.params.id, updateData);
    res.json({ success: true, message: "Vendor updated", affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Toggle status
export const toggleStatus = async (req, res) => {
  try {
    const result = await toggleVendorStatus(req.params.id);
    res.json({ success: true, message: "Status toggled", affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete vendor
export const removeVendor = async (req, res) => {
  try {
    await deleteVendor(req.params.id);
    res.json({ success: true, message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Bulk delete
export const bulkRemoveVendors = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ success: false, message: "No vendor IDs provided" });
    await bulkDeleteVendors(ids);
    res.json({ success: true, message: `${ids.length} vendor(s) deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
