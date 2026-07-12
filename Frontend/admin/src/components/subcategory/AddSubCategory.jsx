
import { useState, useEffect } from "react";

import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/AddSubCategory.css";

const AddSubCategory = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  useEffect(() => {
    fetchParentCategories();
  }, []);

  const fetchParentCategories = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/product-category/all"
      );

      const data = await res.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.log(err);
    }
  };


const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append("category_id", parentCategory);
    formData.append("subcategory_name", subcategoryName);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("status", status);

    if (image) {
      formData.append("image", image);
    }

    const res = await fetch(
      "http://localhost:5000/api/product-subcategory/create",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Sub Category Created Successfully");

      setParentCategory("");
      setSubcategoryName("");
      setSlug("");
      setDescription("");
      setImage(null);
      setStatus("Active");
    }
  } catch (err) {
    console.log(err);
  }
};


  return (
    <>
      <div className="add_sub_category_header">
        <div className="add_sub_category_top">
          <h1 className="add_sub_category_title">
            Add Sub Category
          </h1>

          <Breadcrumb />
        </div>
      </div>

      <div className="add_sub_category_card">

        <h3 className="add_sub_category_heading">
          Add New Sub Category
        </h3>

        <div className="add_sub_category_grid">

          <div className="add_sub_category_field">
            <label>Parent Category</label>

            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option
                  key={cat.category_id}
                  value={cat.category_id}
                >
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="add_sub_category_field">
            <label>Sub Category Name</label>

            <input
              type="text"
              placeholder="Enter sub category name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
            />
          </div>

          <div className="add_sub_category_field">
            <label>Slug</label>

            <input
              type="text"
              placeholder="sub-category-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="add_sub_category_field">
            <label>Status</label>

            <select value={status}
              onChange={(e) => setStatus(e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        <div className="add_sub_category_field">
          <label>Description</label>

          <textarea
            rows="6"
            placeholder="Write sub category description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="add_sub_category_field">
          <label>Upload Sub Category Image</label>

          <div className="add_sub_category_upload">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <p>Drag and drop an image or Browse</p>
          </div>
        </div>

        <div className="add_sub_category_actions">

          <button className="add_sub_category_btn_primary" onClick={handleSubmit}>
            Create Sub Category
          </button>

          <button className="add_sub_category_btn_danger">
            Cancel
          </button>

        </div>

      </div>
    </>
  );
};

export default AddSubCategory;