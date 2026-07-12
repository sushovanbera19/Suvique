import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/SubCategoryList.css";
import {
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const SubCategoryList = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product-subcategory/all");
      const data = await res.json();

      if (data.success) {
        setSubCategories(data.subcategories);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this sub category?");
    if (!ok) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/product-subcategory/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Deleted successfully");
        fetchSubCategories();
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ EDIT
  const handleEdit = (id) => {
    navigate(`/dashboard/sub-categories/edit/${id}`);
  };

  return (
    <>
      <div className="sub_category_list_header">
        <div className="sub_category_list_top">
          <h1 className="sub_category_list_title">
            Sub Category List
          </h1>

          <Breadcrumb />
        </div>
      </div>

      {/* Stats Cards */}

      <div className="sub_category_list_stats">

        <div className="sub_category_list_stat_card">
          <h4>Total Sub Categories</h4>
          <h2>{subCategories.length}</h2>
        </div>

        <div className="sub_category_list_stat_card active">
          <h4>Active Sub Categories</h4>
          <h2>{
            subCategories.filter(
              (item) => item.status === "Active"
            ).length
          }</h2>
        </div>

        <div className="sub_category_list_stat_card inactive">
          <h4>Inactive Sub Categories</h4>
          <h2>{
            subCategories.filter(
              (item) => item.status === "Inactive"
            ).length
          }</h2>
        </div>

      </div>

      {/* Table */}

      <div className="sub_category_list_content">

        <div className="sub_category_list_table_header">
          <h3>All Sub Categories</h3>
        </div>

        <table className="sub_category_list_table">

          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Sub Category</th>
              <th>Parent Category</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {subCategories.map((item) => (
              <tr key={item.subcategory_id}>
                <td>{item.subcategory_id}</td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.subcategory_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>
                <td>{item.subcategory_name}</td>
                <td>{item.category_name}</td>
                <td>{item.slug}</td>
                <td>{item.status}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>

                <td>
                  <div className="sub_category_list_dropdown_wrapper">

                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === item.subcategory_id ? null : item.subcategory_id
                        )
                      }
                    >
                      <FiMoreHorizontal />
                    </button>

                    {openMenu === item.subcategory_id && (
                      <div className="sub_category_list_dropdown_menu">

                        <button onClick={() => handleEdit(item.subcategory_id)}>
                          <FiEdit2 /> Edit
                        </button>

                        <button onClick={() => handleDelete(item.subcategory_id)}>
                          <FiTrash2 /> Delete
                        </button>

                      </div>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </>
  );
};

export default SubCategoryList;