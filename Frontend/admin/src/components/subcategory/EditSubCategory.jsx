import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/AddSubCategory.css";

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_id: "",
    subcategory_name: "",
    slug: "",
    status: "Active",
    description: "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // ================= FETCH CATEGORIES =================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product-category/all");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH SINGLE =================
  useEffect(() => {
    fetchSubCategory();
  }, []);

  const fetchSubCategory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product-subcategory/${id}`
      );

      const data = await res.json();

      if (data.success) {
        const sc = data.subcategory;

        setForm({
          category_id: sc.category_id || "",
          subcategory_name: sc.subcategory_name || "",
          slug: sc.slug || "",
          status: sc.status || "Active",
          description: sc.description || "",
        });

        if (sc.image) {
          setExistingImage(`http://localhost:5000/${sc.image}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setExistingImage(null);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!form.category_id) {
      alert("Please select a Parent Category");
      return;
    }
    if (!form.subcategory_name.trim()) {
      alert("Sub Category Name is required");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("subcategory_name", form.subcategory_name);
    formData.append("slug", form.slug);
    formData.append("status", form.status);
    formData.append("description", form.description);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/product-subcategory/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Sub Category Updated Successfully");
        navigate("/dashboard/sub-categories");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <>
      <div className="add_sub_category_header">
        <div className="add_sub_category_top">
          <h1 className="add_sub_category_title">
            Edit Sub Category
          </h1>

          <Breadcrumb />
        </div>
      </div>

      <div className="add_sub_category_card">
        <h3 className="add_sub_category_heading">
          Update Sub Category
        </h3>

        <div className="add_sub_category_grid">

          {/* Parent Category */}
          <div className="add_sub_category_field">
            <label>Parent Category</label>

            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Category Name */}
          <div className="add_sub_category_field">
            <label>Sub Category Name</label>

            <input
              type="text"
              name="subcategory_name"
              value={form.subcategory_name}
              onChange={handleChange}
            />
          </div>

          {/* Slug */}
          <div className="add_sub_category_field">
            <label>Slug</label>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="add_sub_category_field">
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

        {/* Description */}
        <div className="add_sub_category_field">
          <label>Description</label>

          <textarea
            rows="8"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* IMAGE */}
        <div className="add_sub_category_field">
          <label>Sub Category Image</label>

          <div className="add_sub_category_upload">
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : existingImage ? (
              <img
                src={existingImage}
                alt="Current"
                style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            ) : (
              <p>Drag and drop an image or Browse</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="add_sub_category_actions">

          <button
            className="add_sub_category_btn_primary"
            onClick={handleUpdate}
          >
            Update Sub Category
          </button>

          <button
            className="add_sub_category_btn_danger"
            onClick={() =>
              navigate("/dashboard/sub-categories")
            }
          >
            Cancel
          </button>

        </div>

      </div>
    </>
  );
};

export default EditSubCategory;
