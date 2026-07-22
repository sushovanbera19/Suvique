import Breadcrumb from "../common/Breadcrumb";
import Card from "../common/Card";
import "../../assets/style/settings.css";
import SettingsSaveButton from "../common/SettingsSaveButton";
import { useEffect, useState } from "react";

import { FiSettings, FiUser, FiCreditCard, FiTruck, FiBell, FiShield, FiBox, FiShoppingCart, FiLayout, FiGlobe } from "react-icons/fi";

const API = "http://localhost:5000";

const Settings = () => {
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [storeSettings, setStoreSettings] = useState({
    store_name: "",
    store_email: "",
    store_phone: "",
    business_type: "Ecommerce",
    currency: "USD",
    language: "English",
    timezone: "UTC +5:30",
    country: "India",
    store_status: "Active",
    store_description: "",
  });

  const [userSettings, setUserSettings] = useState({
    staff_role: "Manager",
    permissions: "Full Access",
    access_control: "Enabled",
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripe_api_key: "",
    paypal_api_key: "",
    razorpay_key: "",
    default_payment_method: "COD",
  });

  const [shippingSettings, setShippingSettings] = useState({
    shipping_charges: "",
    delivery_zones: "",
    courier_partner: "",
    delivery_time: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_alerts: false,
    push_notifications: false,
    order_updates: true,
    low_stock_alerts: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_auth: "Disabled",
    session_timeout: "30",
    login_history: "Visible",
  });

  const [productSettings, setProductSettings] = useState({
    default_product_status: "Published",
    sku_format: "SKU-001",
    inventory_tracking: "Enabled",
    variant_settings: "Enabled",
  });

  const [orderSettings, setOrderSettings] = useState({
    auto_invoice: "Enabled",
    refund_rules: "7 Days Return",
    return_policy: "",
    order_status_flow: "Processing",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    dark_mode: "Disabled",
    sidebar_style: "Compact",
    primary_color: "#7c4dff",
    layout_type: "Vertical",
  });

  const [seoSettings, setSeoSettings] = useState({
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    loadSettings();
    fetchProducts();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadSettings = async () => {
    try {
      const res = await fetch(`${API}/api/settings`);
      const data = await res.json();
      if (data.success) {
        const flat = data.data.flat;
        setStoreSettings((prev) => ({
          ...prev,
          store_name: flat.store_name || "",
          store_email: flat.store_email || "",
          store_phone: flat.store_phone || "",
          business_type: flat.business_type || "Ecommerce",
          currency: flat.currency || "USD",
          language: flat.language || "English",
          timezone: flat.timezone || "UTC +5:30",
          country: flat.country || "India",
          store_status: flat.store_status || "Active",
          store_description: flat.store_description || "",
        }));
        setUserSettings((prev) => ({
          ...prev,
          staff_role: flat.staff_role || "Manager",
          permissions: flat.permissions || "Full Access",
          access_control: flat.access_control || "Enabled",
        }));
        setPaymentSettings((prev) => ({
          ...prev,
          stripe_api_key: flat.stripe_api_key || "",
          paypal_api_key: flat.paypal_api_key || "",
          razorpay_key: flat.razorpay_key || "",
          default_payment_method: flat.default_payment_method || "COD",
        }));
        setShippingSettings((prev) => ({
          ...prev,
          shipping_charges: flat.shipping_charges || "",
          delivery_zones: flat.delivery_zones || "",
          courier_partner: flat.courier_partner || "",
          delivery_time: flat.delivery_time || "",
        }));
        setNotificationSettings((prev) => ({
          ...prev,
          email_notifications: flat.email_notifications !== "false",
          sms_alerts: flat.sms_alerts === "true",
          push_notifications: flat.push_notifications === "true",
          order_updates: flat.order_updates !== "false",
          low_stock_alerts: flat.low_stock_alerts !== "false",
        }));
        setSecuritySettings((prev) => ({
          ...prev,
          two_factor_auth: flat.two_factor_auth || "Disabled",
          session_timeout: flat.session_timeout || "30",
          login_history: flat.login_history || "Visible",
        }));
        setProductSettings((prev) => ({
          ...prev,
          default_product_status: flat.default_product_status || "Published",
          sku_format: flat.sku_format || "SKU-001",
          inventory_tracking: flat.inventory_tracking || "Enabled",
          variant_settings: flat.variant_settings || "Enabled",
        }));
        setOrderSettings((prev) => ({
          ...prev,
          auto_invoice: flat.auto_invoice || "Enabled",
          refund_rules: flat.refund_rules || "7 Days Return",
          return_policy: flat.return_policy || "",
          order_status_flow: flat.order_status_flow || "Processing",
        }));
        setAppearanceSettings((prev) => ({
          ...prev,
          dark_mode: flat.dark_mode || "Disabled",
          sidebar_style: flat.sidebar_style || "Compact",
          primary_color: flat.primary_color || "#7c4dff",
          layout_type: flat.layout_type || "Vertical",
        }));
        setSeoSettings((prev) => ({
          ...prev,
          meta_title: flat.meta_title || "",
          meta_description: flat.meta_description || "",
        }));
      }
    } catch (err) {
      console.error("Load settings error:", err);
    }
  };

  const saveSettings = async (settingsArray) => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsArray }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Settings saved successfully");
      } else {
        showToast(data.message || "Save failed");
      }
    } catch (err) {
      console.error("Save settings error:", err);
      showToast("Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleStoreSettings = () => {
    const s = storeSettings;
    saveSettings([
      { key: "store_name", value: s.store_name, group: "store" },
      { key: "store_email", value: s.store_email, group: "store" },
      { key: "store_phone", value: s.store_phone, group: "store" },
      { key: "business_type", value: s.business_type, group: "store" },
      { key: "currency", value: s.currency, group: "store" },
      { key: "language", value: s.language, group: "store" },
      { key: "timezone", value: s.timezone, group: "store" },
      { key: "country", value: s.country, group: "store" },
      { key: "store_status", value: s.store_status, group: "store" },
      { key: "store_description", value: s.store_description, group: "store" },
    ]);
  };

  const handleUserSettings = () => {
    const s = userSettings;
    saveSettings([
      { key: "staff_role", value: s.staff_role, group: "user" },
      { key: "permissions", value: s.permissions, group: "user" },
      { key: "access_control", value: s.access_control, group: "user" },
    ]);
  };

  const handlePaymentSettings = () => {
    const s = paymentSettings;
    saveSettings([
      { key: "stripe_api_key", value: s.stripe_api_key, group: "payment" },
      { key: "paypal_api_key", value: s.paypal_api_key, group: "payment" },
      { key: "razorpay_key", value: s.razorpay_key, group: "payment" },
      { key: "default_payment_method", value: s.default_payment_method, group: "payment" },
    ]);
  };

  const handleShippingSettings = () => {
    const s = shippingSettings;
    saveSettings([
      { key: "shipping_charges", value: s.shipping_charges, group: "shipping" },
      { key: "delivery_zones", value: s.delivery_zones, group: "shipping" },
      { key: "courier_partner", value: s.courier_partner, group: "shipping" },
      { key: "delivery_time", value: s.delivery_time, group: "shipping" },
    ]);
  };

  const handleNotificationSettings = () => {
    const s = notificationSettings;
    saveSettings([
      { key: "email_notifications", value: String(s.email_notifications), group: "notification" },
      { key: "sms_alerts", value: String(s.sms_alerts), group: "notification" },
      { key: "push_notifications", value: String(s.push_notifications), group: "notification" },
      { key: "order_updates", value: String(s.order_updates), group: "notification" },
      { key: "low_stock_alerts", value: String(s.low_stock_alerts), group: "notification" },
    ]);
  };

  const handleSecuritySettings = () => {
    const s = securitySettings;
    saveSettings([
      { key: "two_factor_auth", value: s.two_factor_auth, group: "security" },
      { key: "session_timeout", value: s.session_timeout, group: "security" },
      { key: "login_history", value: s.login_history, group: "security" },
    ]);
  };

  const handleProductSettings = () => {
    const s = productSettings;
    saveSettings([
      { key: "default_product_status", value: s.default_product_status, group: "product" },
      { key: "sku_format", value: s.sku_format, group: "product" },
      { key: "inventory_tracking", value: s.inventory_tracking, group: "product" },
      { key: "variant_settings", value: s.variant_settings, group: "product" },
    ]);
  };

  const handleOrderSettings = () => {
    const s = orderSettings;
    saveSettings([
      { key: "auto_invoice", value: s.auto_invoice, group: "order" },
      { key: "refund_rules", value: s.refund_rules, group: "order" },
      { key: "return_policy", value: s.return_policy, group: "order" },
      { key: "order_status_flow", value: s.order_status_flow, group: "order" },
    ]);
  };

  const handleAppearanceSettings = () => {
    const s = appearanceSettings;
    saveSettings([
      { key: "dark_mode", value: s.dark_mode, group: "appearance" },
      { key: "sidebar_style", value: s.sidebar_style, group: "appearance" },
      { key: "primary_color", value: s.primary_color, group: "appearance" },
      { key: "layout_type", value: s.layout_type, group: "appearance" },
    ]);
  };

  const handleSeoSettings = () => {
    const s = seoSettings;
    saveSettings([
      { key: "meta_title", value: s.meta_title, group: "seo" },
      { key: "meta_description", value: s.meta_description, group: "seo" },
    ]);
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

      const res = await fetch(`${API}/api/products/offer-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Offer Settings Updated Successfully");
        fetchProducts();
      } else {
        showToast(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      showToast("Server Error");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/products`);
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
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const updateStore = (field, value) => setStoreSettings((p) => ({ ...p, [field]: value }));
  const updateUser = (field, value) => setUserSettings((p) => ({ ...p, [field]: value }));
  const updatePayment = (field, value) => setPaymentSettings((p) => ({ ...p, [field]: value }));
  const updateShipping = (field, value) => setShippingSettings((p) => ({ ...p, [field]: value }));
  const updateNotification = (field, value) => setNotificationSettings((p) => ({ ...p, [field]: value }));
  const updateSecurity = (field, value) => setSecuritySettings((p) => ({ ...p, [field]: value }));
  const updateProduct = (field, value) => setProductSettings((p) => ({ ...p, [field]: value }));
  const updateOrder = (field, value) => setOrderSettings((p) => ({ ...p, [field]: value }));
  const updateAppearance = (field, value) => setAppearanceSettings((p) => ({ ...p, [field]: value }));
  const updateSeo = (field, value) => setSeoSettings((p) => ({ ...p, [field]: value }));

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: "#dcfce7", color: "#166534", border: "1px solid #86efac",
          padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", animation: "fadeIn 0.3s ease",
        }}>
          {toast}
        </div>
      )}

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
                <input type="text" placeholder="Enter store name" value={storeSettings.store_name} onChange={(e) => updateStore("store_name", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Store Email</label>
                <input type="email" placeholder="Enter store email" value={storeSettings.store_email} onChange={(e) => updateStore("store_email", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Phone Number</label>
                <input type="text" placeholder="Enter phone number" value={storeSettings.store_phone} onChange={(e) => updateStore("store_phone", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Business Type</label>
                <select value={storeSettings.business_type} onChange={(e) => updateStore("business_type", e.target.value)}>
                  <option>Ecommerce</option>
                  <option>Retail</option>
                  <option>Wholesale</option>
                  <option>Service</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Currency</label>
                <select value={storeSettings.currency} onChange={(e) => updateStore("currency", e.target.value)}>
                  <option>USD</option>
                  <option>INR</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Language</label>
                <select value={storeSettings.language} onChange={(e) => updateStore("language", e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>French</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Timezone</label>
                <select value={storeSettings.timezone} onChange={(e) => updateStore("timezone", e.target.value)}>
                  <option>UTC +5:30</option>
                  <option>UTC +0</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Country</label>
                <select value={storeSettings.country} onChange={(e) => updateStore("country", e.target.value)}>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Store Status</label>
                <select value={storeSettings.store_status} onChange={(e) => updateStore("store_status", e.target.value)}>
                  <option>Active</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div className="settings-page-form-group settings-page-full-width">
                <label>Store Description</label>
                <textarea rows="4" placeholder="Enter store description" value={storeSettings.store_description} onChange={(e) => updateStore("store_description", e.target.value)} />
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Store Settings"} onClick={handleStoreSettings} disabled={saving} />
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
                <label>Staff Roles</label>
                <select value={userSettings.staff_role} onChange={(e) => updateUser("staff_role", e.target.value)}>
                  <option>Manager</option>
                  <option>Editor</option>
                  <option>Support</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Permissions</label>
                <select value={userSettings.permissions} onChange={(e) => updateUser("permissions", e.target.value)}>
                  <option>Full Access</option>
                  <option>Limited Access</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Access Control</label>
                <select value={userSettings.access_control} onChange={(e) => updateUser("access_control", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save User Settings"} onClick={handleUserSettings} disabled={saving} />
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
                <input type="password" placeholder="Stripe key" value={paymentSettings.stripe_api_key} onChange={(e) => updatePayment("stripe_api_key", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>PayPal API Key</label>
                <input type="password" placeholder="PayPal key" value={paymentSettings.paypal_api_key} onChange={(e) => updatePayment("paypal_api_key", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Razorpay Key</label>
                <input type="password" placeholder="Razorpay key" value={paymentSettings.razorpay_key} onChange={(e) => updatePayment("razorpay_key", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Default Payment Method</label>
                <select value={paymentSettings.default_payment_method} onChange={(e) => updatePayment("default_payment_method", e.target.value)}>
                  <option>COD</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>PayPal</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Payment Settings"} onClick={handlePaymentSettings} disabled={saving} />
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
                <input type="text" placeholder="$10" value={shippingSettings.shipping_charges} onChange={(e) => updateShipping("shipping_charges", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Delivery Zones</label>
                <input type="text" placeholder="Zones" value={shippingSettings.delivery_zones} onChange={(e) => updateShipping("delivery_zones", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Courier Partner</label>
                <input type="text" placeholder="DHL / FedEx" value={shippingSettings.courier_partner} onChange={(e) => updateShipping("courier_partner", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Delivery Time</label>
                <input type="text" placeholder="3-5 Days" value={shippingSettings.delivery_time} onChange={(e) => updateShipping("delivery_time", e.target.value)} />
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Shipping Settings"} onClick={handleShippingSettings} disabled={saving} />
            </div>
          </Card>

          {/* ================= NOTIFICATION SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiBell />
              <h3>Notification Settings</h3>
            </div>
            <div className="settings-page-switch-grid">
              <label><input type="checkbox" checked={notificationSettings.email_notifications} onChange={(e) => updateNotification("email_notifications", e.target.checked)} /> Email Notifications</label>
              <label><input type="checkbox" checked={notificationSettings.sms_alerts} onChange={(e) => updateNotification("sms_alerts", e.target.checked)} /> SMS Alerts</label>
              <label><input type="checkbox" checked={notificationSettings.push_notifications} onChange={(e) => updateNotification("push_notifications", e.target.checked)} /> Push Notifications</label>
              <label><input type="checkbox" checked={notificationSettings.order_updates} onChange={(e) => updateNotification("order_updates", e.target.checked)} /> Order Updates</label>
              <label><input type="checkbox" checked={notificationSettings.low_stock_alerts} onChange={(e) => updateNotification("low_stock_alerts", e.target.checked)} /> Low Stock Alerts</label>
            </div>
            <SettingsSaveButton text={saving ? "Saving..." : "Save Notification Settings"} onClick={handleNotificationSettings} disabled={saving} />
          </Card>

          {/* ================= SECURITY SETTINGS ================= */}
          <Card>
            <div className="settings-page-header">
              <FiShield />
              <h3>Security Settings</h3>
            </div>
            <div className="settings-page-grid">
              <div className="settings-page-form-group">
                <label>Two Factor Authentication</label>
                <select value={securitySettings.two_factor_auth} onChange={(e) => updateSecurity("two_factor_auth", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Session Timeout (minutes)</label>
                <input type="text" placeholder="30" value={securitySettings.session_timeout} onChange={(e) => updateSecurity("session_timeout", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Login History</label>
                <select value={securitySettings.login_history} onChange={(e) => updateSecurity("login_history", e.target.value)}>
                  <option>Visible</option>
                  <option>Hidden</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Security Settings"} onClick={handleSecuritySettings} disabled={saving} />
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
                <select value={productSettings.default_product_status} onChange={(e) => updateProduct("default_product_status", e.target.value)}>
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>SKU Format</label>
                <input type="text" placeholder="SKU-001" value={productSettings.sku_format} onChange={(e) => updateProduct("sku_format", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Inventory Tracking</label>
                <select value={productSettings.inventory_tracking} onChange={(e) => updateProduct("inventory_tracking", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Variant Settings</label>
                <select value={productSettings.variant_settings} onChange={(e) => updateProduct("variant_settings", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Product Settings"} onClick={handleProductSettings} disabled={saving} />
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
                <select value={orderSettings.auto_invoice} onChange={(e) => updateOrder("auto_invoice", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Refund Rules</label>
                <input type="text" placeholder="7 Days Return" value={orderSettings.refund_rules} onChange={(e) => updateOrder("refund_rules", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Return Policy</label>
                <input type="text" placeholder="Policy" value={orderSettings.return_policy} onChange={(e) => updateOrder("return_policy", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Order Status Flow</label>
                <select value={orderSettings.order_status_flow} onChange={(e) => updateOrder("order_status_flow", e.target.value)}>
                  <option>Processing</option>
                  <option>Delivered</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Order Settings"} onClick={handleOrderSettings} disabled={saving} />
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
                <select value={appearanceSettings.dark_mode} onChange={(e) => updateAppearance("dark_mode", e.target.value)}>
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Sidebar Style</label>
                <select value={appearanceSettings.sidebar_style} onChange={(e) => updateAppearance("sidebar_style", e.target.value)}>
                  <option>Compact</option>
                  <option>Expanded</option>
                </select>
              </div>
              <div className="settings-page-form-group">
                <label>Primary Color</label>
                <input type="color" value={appearanceSettings.primary_color} onChange={(e) => updateAppearance("primary_color", e.target.value)} />
              </div>
              <div className="settings-page-form-group">
                <label>Layout Type</label>
                <select value={appearanceSettings.layout_type} onChange={(e) => updateAppearance("layout_type", e.target.value)}>
                  <option>Vertical</option>
                  <option>Horizontal</option>
                </select>
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save Appearance"} onClick={handleAppearanceSettings} disabled={saving} />
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
                <input type="text" placeholder="Meta title" value={seoSettings.meta_title} onChange={(e) => updateSeo("meta_title", e.target.value)} />
              </div>
              <div className="settings-page-form-group settings-page-full-width">
                <label>Meta Description</label>
                <textarea rows="3" value={seoSettings.meta_description} onChange={(e) => updateSeo("meta_description", e.target.value)} />
              </div>
              <SettingsSaveButton text={saving ? "Saving..." : "Save SEO Settings"} onClick={handleSeoSettings} disabled={saving} />
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
                      src={`${API}/${product.main_image ? product.main_image.replace(/\\/g, "/") : ""}`}
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
                        onChange={(e) => handleProductChange(product.id, "is_best_seller", e.target.checked ? 1 : 0)}
                      />
                      Best Seller
                    </label>
                    <label className="offer-checkbox">
                      <input
                        type="checkbox"
                        checked={product.is_new_arrival === 1}
                        onChange={(e) => handleProductChange(product.id, "is_new_arrival", e.target.checked ? 1 : 0)}
                      />
                      New Arrival
                    </label>
                    <label className="offer-checkbox">
                      <input
                        type="checkbox"
                        checked={product.is_on_sale === 1}
                        onChange={(e) => handleProductChange(product.id, "is_on_sale", e.target.checked ? 1 : 0)}
                      />
                      On Sale
                    </label>
                    <input
                      type="number"
                      placeholder="Sale Price"
                      value={product.sale_price || ""}
                      onChange={(e) => handleProductChange(product.id, "sale_price", e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Sale Tag"
                      value={product.sale_tag || ""}
                      onChange={(e) => handleProductChange(product.id, "sale_tag", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <SettingsSaveButton text={saving ? "Saving..." : "Save Offer Settings"} onClick={handleOfferSettings} disabled={saving} />
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Settings;
