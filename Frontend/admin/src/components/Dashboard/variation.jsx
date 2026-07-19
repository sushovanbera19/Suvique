import { useState, useEffect, useRef } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/ProductVariation.css";
import { FiMoreHorizontal, FiEdit2, FiTrash2, FiUpload, FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";

const ProductVariation = () => {
  
  const [color, setColor] = useState("#000000");
  const [status, setStatus] = useState("Active");
  const [openMenu, setOpenMenu] = useState(null);
  const [size, setSize] = useState("");
  const [variations, setVariations] = useState([]);
  const [editId, setEditId] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [excelFileName, setExcelFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const excelInputRef = useRef(null);

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/product-variation/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            color_code: color,
            size,
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Variation Added Successfully");

        setColor("#000000");
        setSize("");
        setStatus("Active");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // fetch the variations
  useEffect(() => {
    fetchVariations();
  }, []);
  const fetchVariations = async () => {
    const res = await fetch(
      "http://localhost:5000/api/product-variation/all"
    );

    const data = await res.json();

    if (data.success) {
      setVariations(data.variations);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/product-variation/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchVariations(); // refresh table
      }
    } catch (err) {
      console.log(err);
    }
  };


  const handleEdit = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product-variation/${id}`
      );

      const data = await res.json();

      if (data.success) {
        setEditId(id);

        setColor(data.variation.color_code);
        setSize(data.variation.size);
        setStatus(data.variation.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product-variation/update/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            color_code: color,
            size,
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message);

        setEditId(null);
        setColor("#000000");
        setSize("");
        setStatus("Active");

        fetchVariations();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =====================
  // EXCEL IMPORT
  // =====================
  const handleExcelFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const mapped = jsonData.map((row) => ({
        color_code: row["Color Code"] || row["color_code"] || "#000000",
        size: row["Size"] || row["size"] || "",
        status: row["Status"] || row["status"] || "Active",
      }));

      setExcelData(mapped);
      setShowImportModal(true);
    };

    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const handleBulkImport = async () => {
    if (excelData.length === 0) return;
    setImporting(true);

    try {
      const res = await fetch("http://localhost:5000/api/product-variation/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variations: excelData }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchVariations();
        setShowImportModal(false);
        setExcelData([]);
        setExcelFileName("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Import failed");
    } finally {
      setImporting(false);
    }
  };

  // =====================
  // DOWNLOAD TEMPLATE
  // =====================
  const handleDownloadTemplate = () => {
    const templateData = [
      { "Color Code": "#000000", "Size": "S", "Status": "Active" },
      { "Color Code": "#000000", "Size": "M", "Status": "Active" },
      { "Color Code": "#ffffff", "Size": "L", "Status": "Active" },
      { "Color Code": "#8B4513", "Size": "XL", "Status": "Active" },
      { "Color Code": "#808080", "Size": "S", "Status": "Inactive" },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Variations");
    XLSX.writeFile(wb, "variations_template.xlsx");
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard_variation_header">
        <div className="dashboard_variation_top">
          <h1 className="dashboard_variation_title">
            Product Variations
          </h1>

          <div className="variation-header-actions">
            <button className="variation-btn-template" onClick={handleDownloadTemplate}>
              <FiDownload /> Template
            </button>
            <button className="variation-btn-import" onClick={() => excelInputRef.current?.click()}>
              <FiUpload /> Import Excel
            </button>
            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelFile}
              style={{ display: "none" }}
            />
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="dashboard_variation_card">

        <h3 className="dashboard_variation_heading">
          Product Variations
        </h3>

        <div className="dashboard_variation_grid">

          <div className="dashboard_variation_field">
            <label>Color</label>

            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: "70px", height: "70px", cursor: "pointer", }} required />
          </div>
          <div className="dashboard_variation_field">
            <label>Size</label>
            <input type="text" placeholder="Enter Size" value={size} onChange={(e) => setSize(e.target.value)} required />
          </div>

          <div className="dashboard_variation_field">
            <label>Status</label>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        <div className="dashboard_variation_actions">

          <button
            className="dashboard_variation_btn_primary"
            onClick={
              editId
                ? handleUpdate
                : handleSubmit
            }
          >
            {editId
              ? "Update Variation"
              : "Add Variation"}
          </button>

          <button
            className="dashboard_variation_btn_secondary"
            onClick={() => {
              setEditId(null);
              setColor("#000000");
              setSize("");
              setStatus("Active");
            }}
          >
            Cancel
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="category_list_content">

        <div className="category_list_table_header">
          <h3>All Colors</h3>
        </div>

        <table className="category_list_table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Color</th>
              <th>Color Code</th>
              <th>Size</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {variations.length > 0 ? (
              variations.map((item) => (
                <tr key={item.variation_id}>
                  <td>{item.variation_id}</td>

                  <td>
                    <div style={{ width: "35px", height: "35px", backgroundColor: item.color_code, borderRadius: "6px", border: "1px solid #ddd", }} />
                  </td>
                  <td>{item.color_code}</td>
                  <td>{item.size}</td>

                  <td>
                    <span
                      className={item.status === "Active" ? "status_active" : "status_inactive"} >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <div className="category_list_dropdown_wrapper">
                      <button
                        className="category_list_menu_btn"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === item.variation_id
                              ? null
                              : item.variation_id
                          )
                        }
                      >
                        <FiMoreHorizontal />
                      </button>

                      {openMenu === item.variation_id && (
                        <div className="category_list_dropdown_menu">
                          <button onClick={() =>
                            handleEdit(item.variation_id)
                          }><FiEdit2 /> Edit</button>
                          <button onClick={() =>
                            handleDelete(item.variation_id)
                          }>
                            <FiTrash2 />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No Variations Found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="variation-modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="variation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="variation-modal-header">
              <h3>Import Variations</h3>
              <button className="variation-modal-close" onClick={() => setShowImportModal(false)}>×</button>
            </div>
            <div className="variation-modal-body">
              <p className="variation-modal-info">
                File: <strong>{excelFileName}</strong> — {excelData.length} variations found
              </p>
              <div className="variation-modal-table-wrap">
                <table className="variation-modal-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Color Code</th>
                      <th>Size</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <span className="variation-modal-color-dot" style={{ backgroundColor: row.color_code }} />
                          {row.color_code}
                        </td>
                        <td>{row.size}</td>
                        <td>
                          <span className={`variation-modal-status ${row.status === "Active" ? "active" : "inactive"}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="variation-modal-footer">
              <button className="variation-modal-cancel" onClick={() => setShowImportModal(false)}>Cancel</button>
              <button className="variation-modal-import" onClick={handleBulkImport} disabled={importing}>
                {importing ? "Importing..." : `Import ${excelData.length} Variations`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductVariation;