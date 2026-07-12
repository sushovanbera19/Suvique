import { useState, useEffect, useRef } from "react";
import { FiImage, FiX, FiUpload, FiFileText, FiCheck, FiAlertCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import * as XLSX from "xlsx";
import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import "../../assets/style/products.css";

const DRAFT_KEY = "product_draft";

const emptyForm = {
  productName: "",
  description: "",
  category: "",
  subCategory: "",
  tags: "",
  basePrice: "",
  sku: "",
  quantity: "",
  vat: "",
  discountType: "",
  width: "",
  height: "",
  weight: "",
  shippingCost: "",
  sizes: [],
  colors: [],
  mainImage: null,
  galleryImages: [],
};

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [variations, setVariations] = useState([]);
  const [products, setProducts] = useState([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState(null);
  const [existingGallery, setExistingGallery] = useState([]);

  // EXCEL IMPORT STATE
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [excelFileName, setExcelFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const excelInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);

  // =====================
  // DRAFT - Save to localStorage
  // =====================
  const saveDraft = () => {
    const draftData = { ...form, mainImage: null, galleryImages: [] };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    setHasDraft(true);
    alert("Draft saved successfully");
  };

  // DRAFT - Load from localStorage
  const loadDraft = () => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const draft = JSON.parse(saved);
      setForm((prev) => ({ ...prev, ...draft, mainImage: null, galleryImages: [] }));
      setHasDraft(true);
    }
  };

  // DRAFT - Clear
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  // Check draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      setHasDraft(true);
    }
  }, []);

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
        productName: row["Product Name"] || row["productName"] || "",
        description: row["Description"] || row["description"] || "",
        category: row["Category"] || row["category"] || "",
        subCategory: row["Sub Category"] || row["subCategory"] || "",
        tags: row["Tags"] || row["tags"] || "",
        basePrice: row["Base Price"] || row["basePrice"] || 0,
        sku: row["SKU"] || row["sku"] || "",
        quantity: row["Quantity"] || row["quantity"] || 0,
        vat: row["VAT"] || row["vat"] || 0,
        width: row["Width"] || row["width"] || "",
        height: row["Height"] || row["height"] || "",
        weight: row["Weight"] || row["weight"] || "",
        shippingCost: row["Shipping Cost"] || row["shippingCost"] || 0,
      }));

      setExcelData(mapped);
      setShowExcelModal(true);
    };

    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const handleBulkImport = async () => {
    if (excelData.length === 0) return;
    setImporting(true);

    try {
      const res = await fetch("http://localhost:5000/api/products/bulk-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: excelData }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        fetchProducts();
        setShowExcelModal(false);
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

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // MAIN IMAGE
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, mainImage: file });
    }
  };

  // GALLERY
  const handleGalleryImages = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, galleryImages: [...form.galleryImages, ...files] });
  };

  // SIZE
  const handleSize = (size) => {
    if (form.sizes.includes(size)) {
      setForm({ ...form, sizes: form.sizes.filter((item) => item !== size) });
    } else {
      setForm({ ...form, sizes: [...form.sizes, size] });
    }
  };

  // COLOR
  const handleColor = (color) => {
    if (form.colors.includes(color)) {
      setForm({ ...form, colors: form.colors.filter((item) => item !== color) });
    } else {
      setForm({ ...form, colors: [...form.colors, color] });
    }
  };

  const sizeOptions = [...new Set(variations.map((item) => item.size))];
  const colorOptions = [...new Set(variations.map((item) => item.color_code))];

  useEffect(() => {
    fetchVariations();
  }, []);

  const fetchVariations = async () => {
    const res = await fetch("http://localhost:5000/api/product-variation/all");
    const data = await res.json();
    if (data.success) {
      setVariations(data.variations);
    }
  };

  const removeGalleryImage = (index) => {
    const updated = [...form.galleryImages];
    updated.splice(index, 1);
    setForm({ ...form, galleryImages: updated });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.productName.trim()) { alert("Product Name is required"); return; }
    if (!form.description.trim()) { alert("Description is required"); return; }
    if (!form.category) { alert("Please select a Category"); return; }
    if (!form.subCategory) { alert("Please select a Sub Category"); return; }
    if (!form.tags.trim()) { alert("Please enter Product Tags"); return; }
    if (!form.basePrice) { alert("Base Price is required"); return; }
    if (Number(form.basePrice) <= 0) { alert("Base Price must be greater than 0"); return; }
    if (!form.sku.trim()) { alert("SKU is required"); return; }
    if (!form.quantity) { alert("Quantity is required"); return; }
    if (Number(form.quantity) <= 0) { alert("Quantity must be greater than 0"); return; }
    if (form.vat === "") { alert("VAT is required"); return; }
    if (Number(form.vat) < 0) { alert("VAT cannot be negative"); return; }
    if (!form.width.trim()) { alert("Width is required"); return; }
    if (!form.height.trim()) { alert("Height is required"); return; }
    if (!form.weight.trim()) { alert("Weight is required"); return; }
    if (!form.shippingCost) { alert("Shipping Cost is required"); return; }
    if (Number(form.shippingCost) < 0) { alert("Shipping Cost cannot be negative"); return; }
    if (form.sizes.length === 0) { alert("Please select at least one Size"); return; }
    if (form.colors.length === 0) { alert("Please select at least one Color"); return; }
    if (!editingProduct && !form.mainImage) { alert("Please upload Main Image"); return; }
    if (!editingProduct && form.galleryImages.length === 0) { alert("Please upload at least one Gallery Image"); return; }

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("basePrice", form.basePrice);
    formData.append("sku", form.sku);
    formData.append("quantity", form.quantity);
    formData.append("vat", form.vat);
    formData.append("width", form.width);
    formData.append("height", form.height);
    formData.append("weight", form.weight);
    formData.append("shippingCost", form.shippingCost);
    formData.append("tags", JSON.stringify(form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)));
    formData.append("sizes", JSON.stringify(form.sizes));
    formData.append("colors", JSON.stringify(form.colors));

    const isEditing = !!editingProduct;
    const url = isEditing
      ? `http://localhost:5000/api/products/${editingProduct.id}`
      : "http://localhost:5000/api/products/add";

    if (form.mainImage) {
      formData.append("mainImage", form.mainImage);
    }
    if (form.galleryImages.length > 0) {
      form.galleryImages.forEach((image) => formData.append("galleryImages", image));
    }
    if (isEditing) {
      formData.append("existingGallery", JSON.stringify(existingGallery));
    }

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(isEditing ? "Product Updated Successfully" : "Product Added Successfully");
        fetchProducts();
        if (!isEditing) clearDraft();
        handleCancelEdit();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product-category/all");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchSubCategories(); }, []);
  const fetchSubCategories = async () => {
    const res = await fetch("http://localhost:5000/api/product-subcategory/all");
    const data = await res.json();
    if (data.success) setSubCategories(data.subcategories);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // =====================
  // EDIT PRODUCT
  // =====================
  const handleEditClick = async (product) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await fetch(`http://localhost:5000/api/products/${product.id}`);
      const data = await res.json();
      if (!data.success) { alert("Failed to load product"); return; }

      const p = data.data;
      let parsedTags = "";
      try { parsedTags = JSON.parse(p.tags || "[]").join(", "); } catch { parsedTags = p.tags || ""; }

      setEditingProduct(p);
      setExistingMainImage(p.main_image ? `http://localhost:5000/${p.main_image}` : null);
      try { setExistingGallery(JSON.parse(p.gallery_images || "[]")); } catch { setExistingGallery([]); }

      setForm({
        productName: p.product_name || "",
        description: p.description || "",
        category: p.category_id || "",
        subCategory: p.sub_category_id || "",
        tags: parsedTags,
        basePrice: p.base_price || "",
        sku: p.sku || "",
        quantity: p.quantity || "",
        vat: p.vat ?? "",
        discountType: "",
        width: p.width || "",
        height: p.height || "",
        weight: p.weight || "",
        shippingCost: p.shipping_cost || "",
        sizes: p.sizes || [],
        colors: p.colors || [],
        mainImage: null,
        galleryImages: [],
      });
    } catch (error) {
      console.error(error);
      alert("Error loading product for edit");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setExistingMainImage(null);
    setExistingGallery([]);
    setForm(emptyForm);
  };

  // =====================
  // DELETE PRODUCT
  // =====================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  // =====================
  // TOGGLE STATUS
  // =====================
  const handleToggleStatus = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/status`, { method: "PUT" });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to toggle status");
    }
  };

  return (
    <div className="products-page">

      {/* HEADER */}
      <div className="page-top">
        <h1 className="page-title">Products</h1>
        <Breadcrumb />
      </div>

      {/* EXCEL IMPORT MODAL */}
      {showExcelModal && (
        <div className="excel-modal-overlay" onClick={() => setShowExcelModal(false)}>
          <div className="excel-modal" onClick={(e) => e.stopPropagation()}>
            <div className="excel-modal-header">
              <div className="excel-modal-title">
                <FiFileText size={22} />
                <h3>Import Products from Excel</h3>
              </div>
              <button className="excel-modal-close" onClick={() => setShowExcelModal(false)}>
                <FiX size={20} />
              </button>
            </div>

            <div className="excel-modal-body">
              <div className="excel-file-info">
                <FiFileText size={18} />
                <span>{excelFileName}</span>
                <span className="excel-row-count">{excelData.length} rows found</span>
              </div>

              {excelData.length > 0 && (
                <div className="excel-preview">
                  <h4>Preview</h4>
                  <div className="excel-preview-scroll">
                    <table className="excel-preview-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Name</th>
                          <th>SKU</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.slice(0, 50).map((row, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{row.productName}</td>
                            <td>{row.sku}</td>
                            <td>₹{row.basePrice}</td>
                            <td>{row.quantity}</td>
                            <td>{row.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {excelData.length > 50 && (
                    <p className="excel-more-rows">...and {excelData.length - 50} more rows</p>
                  )}
                </div>
              )}

              <div className="excel-format-hint">
                <FiAlertCircle size={16} />
                <p>Excel columns: Product Name, Description, Category, Sub Category, Tags, Base Price, SKU, Quantity, VAT, Width, Height, Weight, Shipping Cost</p>
              </div>
            </div>

            <div className="excel-modal-footer">
              <button className="excel-cancel-btn" onClick={() => setShowExcelModal(false)}>
                Cancel
              </button>
              <button className="excel-import-btn" onClick={handleBulkImport} disabled={importing || excelData.length === 0}>
                <FiUpload size={16} />
                {importing ? "Importing..." : `Import ${excelData.length} Products`}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="product-layout">

          {/* LEFT SIDE */}
          <div className="left-side">
            {/* MAIN IMAGE */}
            <Card>
              <h3>{editingProduct ? "Update Main Image" : "Upload Main Image"}</h3>
              <div className="upload-box">
                {form.mainImage ? (
                  <img src={URL.createObjectURL(form.mainImage)} alt="" className="preview-image" />
                ) : existingMainImage ? (
                  <img src={existingMainImage} alt="" className="preview-image" />
                ) : (
                  <FiImage size={60} />
                )}
              </div>
              <label className="upload-btn">
                {editingProduct ? "Change Main Image" : "Upload Main Image"}
                <input type="file" hidden onChange={handleMainImage} />
              </label>
            </Card>

            {/* GALLERY */}
            <Card>
              <h3>Gallery Images</h3>
              <div className="gallery-grid">
                {existingGallery.map((imgPath, index) => (
                  <div className="gallery-item" key={`existing-${index}`}>
                    <img src={`http://localhost:5000/${imgPath}`} alt="" />
                    <button type="button" onClick={() => {
                      setExistingGallery((prev) => prev.filter((_, i) => i !== index));
                    }}>
                      <FiX />
                    </button>
                  </div>
                ))}
                {form.galleryImages.map((img, index) => (
                  <div className="gallery-item" key={`new-${index}`}>
                    <img src={URL.createObjectURL(img)} alt="" />
                    <button type="button" onClick={() => removeGalleryImage(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <label className="upload-btn">
                Upload Gallery
                <input type="file" multiple hidden onChange={handleGalleryImages} />
              </label>
            </Card>

            {/* PRODUCT DETAILS */}
            <Card>
              <h3>Product Details</h3>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleInputChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Sub Category</label>
                <select name="subCategory" value={form.subCategory} onChange={handleInputChange}>
                  <option value="">Select Sub Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub.subcategory_id} value={sub.subcategory_id}>{sub.subcategory_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Tags</label>
                <input type="text" name="tags" placeholder="shirt, fashion" value={form.tags} onChange={handleInputChange} />
              </div>
            </Card>

            {/* ATTRIBUTES */}
            <Card>
              <h3>Product Attribute</h3>
              <div className="attribute-section">
                <label>Sizes</label>
                <div className="size-wrap">
                  {sizeOptions.map((size) => (
                    <button type="button" key={size} className={`size-btn ${form.sizes.includes(size) ? "active-size" : ""}`} onClick={() => handleSize(size)}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="attribute-section">
                <label>Colors</label>
                <div className="color-wrap">
                  {colorOptions.map((color, index) => (
                    <div
                      key={index}
                      className={`color-box ${form.colors.includes(color) ? "active-color" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColor(color)}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE */}
          <div className="right-side">
            {/* PRODUCT INFO */}
            <Card>
              <h3>Product Information</h3>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="productName" placeholder="Product Name" value={form.productName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="6" name="description" placeholder="Product Description" value={form.description} onChange={handleInputChange}></textarea>
              </div>
            </Card>

            {/* DETAILS */}
            <Card>
              <h3>Details</h3>
              <div className="details-grid">
                <div className="form-group">
                  <label>Base Price</label>
                  <input type="number" name="basePrice" placeholder="Product Price" value={form.basePrice} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" name="sku" placeholder="SKU" value={form.sku} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>VAT Amount (%)</label>
                  <input type="number" name="vat" placeholder="VAT" value={form.vat} onChange={handleInputChange} />
                </div>
              </div>
            </Card>

            {/* SHIPPING */}
            <Card>
              <h3>Shipping</h3>
              <div className="details-grid">
                <div className="form-group">
                  <label>Width</label>
                  <input type="text" placeholder="Width" name="width" value={form.width} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Height</label>
                  <input type="text" placeholder="height" name="height" value={form.height} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input type="text" placeholder="weight" name="weight" value={form.weight} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Shipping Cost</label>
                  <input type="number" placeholder="shippingCost" name="shippingCost" value={form.shippingCost} onChange={handleInputChange} />
                </div>
              </div>
            </Card>

            {/* BUTTONS */}
            <div className="product-btns">
              {editingProduct ? (
                <>
                  <button type="submit" className="publish-btn">
                    <FiCheck size={16} /> Update Product
                  </button>
                  <button type="button" className="draft-btn" onClick={handleCancelEdit}>
                    <FiX size={16} /> Cancel Edit
                  </button>
                </>
              ) : (
                <>
                  <button type="submit" className="publish-btn">
                    <FiCheck size={16} /> Publish
                  </button>
                  <button type="button" className="draft-btn" onClick={saveDraft}>
                    <FiFileText size={16} /> Save Draft
                  </button>
                  <button type="button" className="draft-btn" onClick={() => excelInputRef.current.click()}>
                    <FiUpload size={16} /> Import Excel
                  </button>
                </>
              )}
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                hidden
                onChange={handleExcelFile}
              />
            </div>

            {/* DRAFT RESTORE */}
            {hasDraft && (
              <div className="draft-restore-banner">
                <div className="draft-restore-info">
                  <FiFileText size={18} />
                  <span>You have a saved draft</span>
                </div>
                <div className="draft-restore-actions">
                  <button type="button" className="draft-restore-btn" onClick={loadDraft}>
                    Restore
                  </button>
                  <button type="button" className="draft-clear-btn" onClick={clearDraft}>
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* PRODUCT LIST */}
      <div className="product-show-list">
        {products.map((item) => (
          <Card key={item.id}>
            <div className="saved-product">
              <img
                src={`http://localhost:5000/${item.main_image}`}
                alt={item.product_name}
              />
              <div className="saved-product-content">
                <h4>{item.product_name}</h4>
                <p>{item.description}</p>
                <div className="product-meta-info">
                  <span>₹{item.base_price}</span>
                  <span>{item.quantity} Stock</span>
                  <span className={`product-status-badge ${(item.status || "active") === "active" ? "status-active" : "status-inactive"}`}>
                    {(item.status || "active") === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="product-card-actions">
                  <label className="product-toggle-switch">
                    <input
                      type="checkbox"
                      checked={(item.status || "active") === "active"}
                      onChange={() => handleToggleStatus(item.id)}
                    />
                    <span className="product-toggle-slider"></span>
                  </label>
                  <button className="product-edit-btn" onClick={() => handleEditClick(item)}>
                    <FiEdit2 size={14} /> Edit
                  </button>
                  <button className="product-delete-btn" onClick={() => handleDeleteProduct(item.id)}>
                    <FiTrash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
