import { useState, useEffect } from "react";
import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/CategoryList.css";
import { useNavigate } from "react-router-dom";
import {
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/product-category/all"
      );

      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/categories/edit/${id}`);
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/product-category/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Category deleted successfully");

        // refresh list
        fetchCategories();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <>
      <div className="category_list_header">
        <div className="category_list_top">
          <h1 className="category_list_title">
            Category List
          </h1>

          <Breadcrumb />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="category_list_stats">

        <div className="category_list_stat_card">
          <h4>Total Categories</h4>
          <h2>{categories.length}</h2>
        </div>

        <div className="category_list_stat_card active">
          <h4>Active Categories</h4>
          <h2>
            {
              categories.filter(
                (item) => item.status === "Active"
              ).length
            }
          </h2>
        </div>

        <div className="category_list_stat_card inactive">
          <h4>Inactive Categories</h4>
          <h2>
            {
              categories.filter(
                (item) => item.status === "Inactive"
              ).length
            }
          </h2>
        </div>

      </div>

      {/* Table Card */}
      <div className="category_list_content">

        <div className="category_list_table_header">
          <h3>All Categories</h3>
        </div>

        <table className="category_list_table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((item) => (
              <tr key={item.category_id}>
                <td>{item.category_id}</td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.category_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </td>
                <td>{item.category_name}</td>

                <td>{item.slug}</td>
                <td>
                  <span
                    className={
                      item.status === "Active"
                        ? "status_active"
                        : "status_inactive"
                    }
                  >
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
                          openMenu === item.category_id
                            ? null
                            : item.category_id
                        )
                      }
                    >
                      <FiMoreHorizontal />
                    </button>

                    {openMenu === item.category_id && (

                      <div className="category_list_dropdown_menu">

                        <button
                          onClick={() =>
                            handleEdit(item.category_id)
                          }
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item.category_id)
                          }
                        >
                          <FiTrash2 />
                          Delete
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

export default CategoryList;