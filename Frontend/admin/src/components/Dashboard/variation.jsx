import { useState, useEffect } from "react";
import Breadcrumb from "../common/Breadcrumb";
import "../../assets/style/ProductVariation.css";
import { FiMoreHorizontal, FiEdit2, FiTrash2, } from "react-icons/fi";

const ProductVariation = () => {
  
  const [color, setColor] = useState("#000000");
  const [status, setStatus] = useState("Active");
  const [openMenu, setOpenMenu] = useState(null);
  const [size, setSize] = useState("");
  const [variations, setVariations] = useState([]);
  const [editId, setEditId] = useState(null);

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

  return (
    <>
      {/* Header */}
      <div className="dashboard_variation_header">
        <div className="dashboard_variation_top">
          <h1 className="dashboard_variation_title">
            Product Variations
          </h1>

          <Breadcrumb />
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
    </>
  );
};

export default ProductVariation;