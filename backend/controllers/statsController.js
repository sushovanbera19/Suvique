import {
  getCounts,
  getMonthlyRevenue,
  getRecentOrders,
  getTopSellingProducts,
  getTopCustomers,
  getOrdersByStatus,
  getOrdersByCountry,
  getOrdersByPaymentMethod,
  getOrdersByCurrency,
  getOrdersPerMonth,
} from "../models/statsModel.js";

export const getOverviewStats = async (req, res) => {
  try {
    const [
      counts,
      monthlyRevenue,
      recentOrders,
      topSellingProducts,
      topCustomers,
      ordersByStatus,
    ] = await Promise.all([
      getCounts(),
      getMonthlyRevenue(),
      getRecentOrders(),
      getTopSellingProducts(),
      getTopCustomers(),
      getOrdersByStatus(),
    ]);

    res.json({
      success: true,
      data: {
        counts,
        monthlyRevenue,
        recentOrders,
        topSellingProducts,
        topCustomers,
        ordersByStatus,
      },
    });
  } catch (err) {
    console.error("Stats fetch error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch stats", error: err.message });
  }
};

export const getAnalyticsStats = async (req, res) => {
  try {
    const [
      counts,
      ordersByCountry,
      ordersByPaymentMethod,
      ordersByCurrency,
      ordersPerMonth,
    ] = await Promise.all([
      getCounts(),
      getOrdersByCountry(),
      getOrdersByPaymentMethod(),
      getOrdersByCurrency(),
      getOrdersPerMonth(),
    ]);

    res.json({
      success: true,
      data: {
        counts,
        ordersByCountry,
        ordersByPaymentMethod,
        ordersByCurrency,
        ordersPerMonth,
      },
    });
  } catch (err) {
    console.error("Analytics fetch error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch analytics", error: err.message });
  }
};
