
import { useState } from "react";
import Breadcrumb from "../../components/common/Breadcrumb";
import "../../assets/style/AddCategory.css";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Active");
  const [displayType, setDisplayType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [importFile, setImportFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("categoryName", categoryName);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("status", status);
      formData.append("displayType", displayType);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(
        "http://localhost:5000/api/product-category/add",
        {
          method: "POST",
          body: formData, // ❌ no JSON
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Category Created Successfully");

        setCategoryName("");
        setSlug("");
        setDescription("");
        setImage(null);
        setStatus("Active");
        setDisplayType("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const response = await fetch(
        "http://localhost:5000/api/product-category/import",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setImportFile(null);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Import Failed");
    }
  };
  return (
    <>
      <div className="add_category_header">
        <div className="add_category_top">
          <h1 className="add_category_title">
            Add Category
          </h1>

          <Breadcrumb />
        </div>
      </div>

      <form
        className="add_category_card"
        onSubmit={handleSubmit}
      >

        <h3 className="add_category_heading">
          Add New Category
        </h3>

        {/* Row 1 */}
        <div className="add_category_grid">

          <div className="add_category_field">
            <label>Category Name</label>
            <input
              type="text"
              placeholder="Category name"
              value={categoryName}
              onChange={(e) =>
                setCategoryName(e.target.value)
              }
            />
          </div>

          <div className="add_category_field">
            <label>Slug</label>
            <input
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
            />
          </div>

          <div className="add_category_field">
            <label>Status</label>

            <select value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="add_category_field">
            <label>Display Type</label>

            <select value={displayType}
              onChange={(e) =>
                setDisplayType(e.target.value)
              }>
              <option>Select</option>
            </select>
          </div>

        </div>

        {/* Description */}

        <div className="add_category_field">
          <label>Description</label>

          <textarea
            rows="8"
            placeholder="Write category description..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* Upload */}

        <div className="add_category_field">
          <label>Upload New Category Image</label>

          <div className="add_category_upload">
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <p>
              Drag and drop an image or Browse
            </p>
          </div>
        </div>

        {/* Buttons */}

        <div className="add_category_actions">
          <button className="add_category_btn_primary">
            Create Category
          </button>

          <button className="add_category_btn_danger">
            Cancel
          </button>

        </div>

      </form>
      <div className="add_category_import">
        <h4>Import Categories</h4>

        <input
          type="file"
          accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
          onChange={(e) => setImportFile(e.target.files[0])}
        />

        <button
          type="button"
          className="import_btn"
          onClick={handleImport}
        >
          Import File
        </button>
      </div>
    </>
  );
};

export default AddCategory;