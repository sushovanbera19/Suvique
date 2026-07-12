import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/AddCategory.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    categoryName: "",
    slug: "",
    status: "Active",
    description: "",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // =========================
  // FETCH SINGLE CATEGORY
  // =========================
  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product-category/${id}`
      );

      const data = await res.json();

      if (data.success) {
        const c = data.category;

        setForm({
          categoryName: c.category_name || "",
          slug: c.slug || "",
          status: c.status || "Active",
          description: c.description || "",
        });

        if (c.image) {
          setExistingImage(`http://localhost:5000/${c.image}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setExistingImage(null);
    }
  };

  // =========================
  // UPDATE CATEGORY
  // =========================
  const handleUpdate = async () => {
    if (!form.categoryName.trim()) {
      alert("Category Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", form.categoryName);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("status", form.status);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/product-category/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Category Updated Successfully");
        navigate("/dashboard/categories");
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
      {/* HEADER */}
      <div className="add_category_header">
        <div className="add_category_top">
          <h1 className="add_category_title">Edit Category</h1>
          <Breadcrumb />
        </div>
      </div>

      {/* FORM */}
      <div className="add_category_card">
        <h3 className="add_category_heading">Update Category</h3>

        <div className="add_category_grid">
          <div className="add_category_field">
            <label>Category Name</label>
            <input
              type="text"
              name="categoryName"
              value={form.categoryName}
              onChange={handleChange}
            />
          </div>

          <div className="add_category_field">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
            />
          </div>

          <div className="add_category_field">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="add_category_field">
          <label>Description</label>
          <textarea
            rows="8"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="add_category_field">
          <label>Category Image</label>
          <div className="add_category_upload">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
              />
            ) : existingImage ? (
              <img
                src={existingImage}
                alt="Current"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
              />
            ) : (
              <p>Drag and drop an image or Browse</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <div className="add_category_actions">
          <button
            className="add_category_btn_primary"
            onClick={handleUpdate}
          >
            Update Category
          </button>

          <button
            className="add_category_btn_danger"
            onClick={() => navigate("/dashboard/categories")}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
