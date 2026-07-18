import db from "../config/db.js";

export const getAllContacts = () => {
  const sql = "SELECT * FROM contacts ORDER BY created_at DESC";
  return db.promise().query(sql);
};

export const getContactById = (id) => {
  const sql = "SELECT * FROM contacts WHERE id = ?";
  return db.promise().query(sql, [id]);
};

export const getContactsByStatus = (status) => {
  const sql = "SELECT * FROM contacts WHERE status = ? ORDER BY created_at DESC";
  return db.promise().query(sql, [status]);
};

export const insertContact = (data) => {
  const sql = "INSERT INTO contacts (name, email, message, status) VALUES (?, ?, ?, ?)";
  return db.promise().query(sql, [
    data.name,
    data.email,
    data.message,
    data.status || "unread",
  ]);
};

export const updateContactStatus = (id, status) => {
  const sql = "UPDATE contacts SET status = ? WHERE id = ?";
  return db.promise().query(sql, [status, id]);
};

export const deleteContact = (id) => {
  const sql = "DELETE FROM contacts WHERE id = ?";
  return db.promise().query(sql, [id]);
};

export const bulkDeleteContacts = (ids) => {
  const sql = "DELETE FROM contacts WHERE id IN (?)";
  return db.promise().query(sql, [ids]);
};

export const getContactStats = () => {
  const total = "SELECT COUNT(*) as total FROM contacts";
  const unread = "SELECT COUNT(*) as count FROM contacts WHERE status = 'unread'";
  const read = "SELECT COUNT(*) as count FROM contacts WHERE status = 'read'";
  const replied = "SELECT COUNT(*) as count FROM contacts WHERE status = 'replied'";
  const archived = "SELECT COUNT(*) as count FROM contacts WHERE status = 'archived'";
  return Promise.all([
    db.promise().query(total),
    db.promise().query(unread),
    db.promise().query(read),
    db.promise().query(replied),
    db.promise().query(archived),
  ]);
};
