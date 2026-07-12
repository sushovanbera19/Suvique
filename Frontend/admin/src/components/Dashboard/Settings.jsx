import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import "../../assets/style/settings.css";
import SettingsSaveButton from "../common/SettingsSaveButton";
import { useEffect, useState } from "react";

import { FiSettings, FiUser, FiCreditCard, FiTruck, FiBell, FiShield, FiBox, FiShoppingCart, FiLayout, FiGlobe, } from "react-icons/fi";

const Settings = () => {
  const [products, setProducts] = useState([]);
  const handleStoreSettings = () => {
    console.log("Store Settings Saved");
  };

  const handleUserSettings = () => {
    console.log("User Settings Saved");
  };

  const handlePaymentSettings = () => {
    console.log("Payment Settings Saved");
  };

  const handleShippingSettings = () => {
    console.log("Shipping Settings Saved");
  };

  const handleNotificationSettings = () => {
    console.log("Notification Settings Saved");
  };

  const handleSecuritySettings = () => {
    console.log("Security Settings Saved");
  };

  const handleProductSettings = () => {
    console.log("Product Settings Saved");
  };

  const handleOrderSettings = () => {
    console.log("Order Settings Saved");
  };

  const handleAppearanceSettings = () => {
    console.log("Appearance Saved");
  };

  const handleSeoSettings = () => {
    console.log("SEO Saved");
  };

  const handleOfferSettings = async () => {
    try {
      const payload = products.map((p) => ({
        id: Number(p.id),
        is_best_seller: p.is_best_seller ? 1 : 0,
        is_new_arrival: p.is_new_arrival ? 1 : 0,
        is_on_sale: p.is_on_sale ? 1 : 0,
        sale_price: p.sale_price ? Number(p.sale_price) : null,
        sale_tag: p.sale_tag || null,
      }));

      const res = await fetch(
        "http://localhost:5000/api/products/offer-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Offer Settings Updated Successfully");
        fetchProducts();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, [field]: value }
          : product
      )
    );
  };
  return (
    <div>

      {/* PAGE TOP */}
      <div className="settings-page-top">
        <h1 className="settings-page-title">Settings</h1>
        <Breadcrumb />
      </div>

      {/* PAGE BODY */}
      <div className="settings-page-body">
        <div className="settings-page-wrapper">

          {/* ================= STORE SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiSettings />
              <h3>Store Settings</h3>
            </div>

            <div className="settings-page-grid">

              <div className="settings-page-form-group">
                <label>Store Name</label>
                <input type="text" placeholder="Enter store name" />
              </div>

              <div className="settings-page-form-group">
                <label>Store Logo</label>
                <input type="file" />
              </div>

              <div className="settings-page-form-group">
                <label>Store Email</label>
                <input type="email" placeholder="Enter store email" />
              </div>

              <div className="settings-page-form-group">
                <label>Phone Number</label>
                <input type="text" placeholder="Enter phone number" />
              </div>

              <div className="settings-page-form-group">
                <label>Business Type</label>
                <select>
                  <option>Ecommerce</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>Service</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Currency</label>
                <select>
                  <option>USD</option>
                  <option>INR</option>
                  <option>EUR</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Language</label>
                <select>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>French</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Timezone</label>
                <select>
                  <option>UTC +5:30</option>
                  <option>UTC +0</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Country</label>
                <select>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Store Status</label>
                <select>
                  <option>Active</option>
                  <option>Maintenance</option>
                </select>
              </div>

              <div className="settings-page-form-group settings-page-full-width">
                <label>Store Description</label>
                <textarea rows="4" placeholder="Enter store description" />
              </div>
              <SettingsSaveButton
                text="Save Store Settings"
                onClick={handleStoreSettings}
              />
            </div>
          </Card>

          {/* ================= USER & ROLES ================= */}
          <Card>
            <div className="settings-page-header">
              <FiUser />
              <h3>User & Roles</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Admin Users</label>
                <input type="number" placeholder="Total admins" />
              </div>

              <div className="settings-page-form-group">
                <label>Staff Roles</label>
                <select>
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Support</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Permissions</label>
                <select>
                  <option>Full Access</option>
                  <option>Limited Access</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Access Control</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save User Settings"
                onClick={handleUserSettings}
              />
            </div>
          </Card>

          {/* ================= PAYMENT SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiCreditCard />
              <h3>Payment Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Stripe API Key</label>
                <input type="text" placeholder="Stripe key" />
              </div>

              <div className="settings-page-form-group">
                <label>PayPal API Key</label>
                <input type="text" placeholder="PayPal key" />
              </div>

              <div className="settings-page-form-group">
                <label>Razorpay Key</label>
                <input type="text" placeholder="Razorpay key" />
              </div>

              <div className="settings-page-form-group">
                <label>Payment Method</label>
                <select>
                  <option>COD</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save Payment Settings"
                onClick={handlePaymentSettings}
              />
            </div>
          </Card>

          {/* ================= SHIPPING SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiTruck />
              <h3>Shipping Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Shipping Charges</label>
                <input type="text" placeholder="$10" />
              </div>

              <div className="settings-page-form-group">
                <label>Delivery Zones</label>
                <input type="text" placeholder="Zones" />
              </div>

              <div className="settings-page-form-group">
                <label>Courier Partner</label>
                <input type="text" placeholder="DHL / FedEx" />
              </div>

              <div className="settings-page-form-group">
                <label>Delivery Time</label>
                <input type="text" placeholder="3-5 Days" />
              </div>
              <SettingsSaveButton
                text="Save Shipping Settings"
                onClick={handleShippingSettings}
              />
            </div>
          </Card>

          {/* ================= NOTIFICATION SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiBell />
              <h3>Notification Settings</h3>
            </div>

            <div className="settings-page-switch-grid">
              <label><input type="checkbox" /> Email Notifications</label>
              <label><input type="checkbox" /> SMS Alerts</label>
              <label><input type="checkbox" /> Push Notifications</label>
              <label><input type="checkbox" /> Order Updates</label>
              <label><input type="checkbox" /> Low Stock Alerts</label>
            </div>
            <SettingsSaveButton
              text="Save Notification Settings"
              onClick={handleNotificationSettings}
            />
          </Card>

          {/* ================= SECURITY SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiShield />
              <h3>Security Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Change Password</label>
                <input type="password" placeholder="New password" />
              </div>

              <div className="settings-page-form-group">
                <label>Two Factor Authentication</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Session Timeout</label>
                <input type="text" placeholder="30 mins" />
              </div>

              <div className="settings-page-form-group">
                <label>Login History</label>
                <select>
                  <option>Visible</option>
                  <option>Hidden</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save Security Settings"
                onClick={handleSecuritySettings}
              />
            </div>
          </Card>

          {/* ================= PRODUCT SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiBox />
              <h3>Product Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Default Product Status</label>
                <select>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>SKU Format</label>
                <input type="text" placeholder="SKU-001" />
              </div>

              <div className="settings-page-form-group">
                <label>Inventory Tracking</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Variant Settings</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save Product Settings"
                onClick={handleProductSettings}
              />
            </div>
          </Card>

          {/* ================= ORDER SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiShoppingCart />
              <h3>Order Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Auto Invoice</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Refund Rules</label>
                <input type="text" placeholder="7 Days Return" />
              </div>

              <div className="settings-page-form-group">
                <label>Return Policy</label>
                <input type="text" placeholder="Policy" />
              </div>

              <div className="settings-page-form-group">
                <label>Order Status Flow</label>
                <select>
                  <option>Processing</option>
                  <option>Delivered</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save Order Settings"
                onClick={handleOrderSettings}
              />
            </div>
          </Card>

          {/* ================= APPEARANCE ================= */}
          <Card>
            <div className="settings-page-header">
              <FiLayout />
              <h3>Theme / Appearance</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Dark Mode</label>
                <select>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Sidebar Style</label>
                <select>
                  <option>Compact</option>
                  <option>Expanded</option>
                </select>
              </div>

              <div className="settings-page-form-group">
                <label>Primary Color</label>
                <input type="color" />
              </div>

              <div className="settings-page-form-group">
                <label>Layout Type</label>
                <select>
                  <option>Vertical</option>
                  <option>Horizontal</option>
                </select>
              </div>
              <SettingsSaveButton
                text="Save Appearance"
                onClick={handleAppearanceSettings}
              />
            </div>
          </Card>

          {/* ================= SEO SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiGlobe />
              <h3>SEO Settings</h3>
            </div>

            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Meta Title</label>
                <input type="text" placeholder="Meta title" />
              </div>

              <div className="settings-page-form-group settings-page-full-width">
                <label>Meta Description</label>
                <textarea rows="3" />
              </div>
              <SettingsSaveButton
                text="Save SEO Settings"
                onClick={handleSeoSettings}
              />
            </div>
          </Card>
          {/* ================= FEATURED PRODUCTS CONTROL ================= */}
          <Card>
            <div className="settings-page-header">
              <FiBox />
              <h3>Products Offer & Sale Settings</h3>
            </div>

            <div className="offer-products-list">

              {products.map((product) => (
                <div className="offer-product-card" key={product.id}>

                  <div className="offer-product-info">
                    <img
                      src={`http://localhost:5000/${product.main_image}`}
                      alt={product.product_name}
                    />

                    <div>
                      <h4>{product.product_name}</h4>
                      <p>₹ {product.base_price}</p>
                    </div>
                  </div>

                  <div className="offer-options">

                    <label className="offer-checkbox">
                      <input
                        type="checkbox"
                        checked={product.is_best_seller === 1}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "is_best_seller",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                      Best Seller
                    </label>

                    <label className="offer-checkbox">
                      <input
                        type="checkbox"
                        checked={product.is_new_arrival === 1}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "is_new_arrival",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                      New Arrival
                    </label>

                    <label className="offer-checkbox">
                      <input
                        type="checkbox"
                        checked={product.is_on_sale === 1}
                        onChange={(e) =>
                          handleProductChange(
                            product.id,
                            "is_on_sale",
                            e.target.checked ? 1 : 0
                          )
                        }
                      />
                      On Sale
                    </label>

                    <input
                      type="number"
                      placeholder="Sale Price"
                      value={product.sale_price || ""}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "sale_price",
                          e.target.value
                        )
                      }
                    />

                    <input
                      type="text"
                      placeholder="Sale Tag"
                      value={product.sale_tag || ""}
                      onChange={(e) =>
                        handleProductChange(
                          product.id,
                          "sale_tag",
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>
              ))}

            </div>

            <SettingsSaveButton
              text="Save Offer Settings"
              onClick={handleOfferSettings}
            />
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Settings;