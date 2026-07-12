import Card from "../../components/common/Card";
import "../../assets/style/OrderDetails.css";
import { useState, useEffect } from "react";
import {
    RiCheckboxCircleFill,
    RiLoader4Line,
    RiMapPinLine,
    RiBankCardLine,
} from "react-icons/ri";

const OrderDetails = ({ selectedOrder, setShowOrderDetails }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!selectedOrder?.id) return;

        const fetchOrderItems = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/orders/${selectedOrder.id}`
                );
                const data = await res.json();
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderItems();
    }, [selectedOrder]);

    if (!selectedOrder) return null;

    const order = selectedOrder;

    const subtotal = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const getProgressSteps = () => {
        const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
        const currentIndex = statuses.indexOf(order.order_status);
        return statuses.map((status, i) => ({
            label: status,
            state: i < currentIndex ? "active" : i === currentIndex ? "processing" : "",
        }));
    };

    const steps = getProgressSteps();

    return (
        <div className="order-details-page">
            {/* TOP GRID */}
            <div className="order-details-grid">
                {/* LEFT SIDE */}
                <div className="order-details-left">
                    {/* ORDER INFO */}
                    <Card className="order-details-card">
                        <div className="order-details-top">
                            <div>
                                <div className="order-details-title-row">
                                    <h2>#{order.id}</h2>
                                    <span
                                        className={`order-badge-paid ${
                                            order.payment_status !== "Paid"
                                                ? "order-badge-pending"
                                                : ""
                                        }`}
                                    >
                                        {order.payment_status}
                                    </span>
                                    <span className="order-badge-progress">
                                        {order.order_status}
                                    </span>
                                </div>
                                <p className="order-details-subtitle">
                                    Order / Order Details / #{order.id}
                                </p>
                            </div>
                            <div className="order-details-actions">
                                <button
                                    className="order-edit-btn"
                                    onClick={() => setShowOrderDetails(false)}
                                >
                                    Back to Orders
                                </button>
                            </div>
                        </div>

                        {/* PROGRESS */}
                        <div className="order-progress-wrapper">
                            {steps.map((step, i) => (
                                <div className="order-progress-item" key={i}>
                                    <div
                                        className={`order-progress-bar ${step.state}`}
                                    ></div>
                                    <p>{step.label}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* PRODUCTS */}
                    <Card className="order-details-card">
                        <div className="order-section-title">Products</div>

                        <div className="order-product-table-wrapper">
                            <table className="order-product-table">
                                <thead>
                                    <tr>
                                        <th>Product Name & SKU</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "40px",
                                                }}
                                            >
                                                Loading products...
                                            </td>
                                        </tr>
                                    ) : products.length > 0 ? (
                                        products.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="order-product-info">
                                                        <img
                                                            src={
                                                                item.main_image ||
                                                                "https://cdn-icons-png.flaticon.com/128/892/892458.png"
                                                            }
                                                            alt={item.product_name}
                                                        />
                                                        <div>
                                                            <h4>
                                                                {item.product_name}
                                                            </h4>
                                                            <p>SKU: {item.sku || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.quantity}</td>
                                                <td>₹ {item.price}</td>
                                                <td>
                                                    ₹ {(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                style={{
                                                    textAlign: "center",
                                                    padding: "40px",
                                                }}
                                            >
                                                No products found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* RIGHT SIDE */}
                <div className="order-details-right">
                    {/* ORDER SUMMARY */}
                    <Card className="order-details-card">
                        <div className="order-section-title">Order Summary</div>
                        <div className="order-summary-list">
                            <div>
                                <span>Sub Total :</span>
                                <strong>₹ {subtotal.toFixed(2)}</strong>
                            </div>
                            <div>
                                <span>Total Amount :</span>
                                <strong>₹ {order.total}</strong>
                            </div>
                        </div>
                        <div className="order-summary-total">
                            <span>Total Amount</span>
                            <strong>₹ {order.total}</strong>
                        </div>
                    </Card>

                    {/* PAYMENT */}
                    <Card className="order-details-card">
                        <div className="order-section-title">
                            Payment Information
                        </div>
                        <div className="order-payment-card">
                            <div className="order-payment-icon">
                                <RiBankCardLine />
                            </div>
                            <div>
                                <h4>{order.payment_method || "N/A"}</h4>
                                <p>Status: {order.payment_status}</p>
                            </div>
                        </div>
                    </Card>

                    {/* CUSTOMER */}
                    <Card className="order-details-card">
                        <div className="order-section-title">
                            Customer Details
                        </div>
                        <div className="order-customer-box">
                            <div className="order-customer-avatar">
                                {order.customer_name
                                    ? order.customer_name
                                          .charAt(0)
                                          .toUpperCase()
                                    : "U"}
                            </div>
                            <div>
                                <h4>{order.customer_name || "N/A"}</h4>
                                <p>{order.email || "N/A"}</p>
                            </div>
                        </div>

                        <div className="order-address-box">
                            <div>
                                <RiMapPinLine />
                            </div>
                            <div>
                                <h5>Shipping Address</h5>
                                <p>
                                    {order.street && `${order.street}, `}
                                    {order.city && `${order.city}, `}
                                    {order.country || "N/A"}
                                    {order.zip_code && ` - ${order.zip_code}`}
                                </p>
                                {order.phone && (
                                    <p style={{ marginTop: "8px" }}>
                                        Phone: {order.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <button
                className="order-back-btn"
                onClick={() => setShowOrderDetails(false)}
            >
                <span className="order-back-icon">←</span>
            </button>
        </div>
    );
};

export default OrderDetails;
