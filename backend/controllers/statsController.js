import {
  getCounts,
  getMonthlyRevenue,
  getRecentOrders,
  getTopSellingProducts,
  getTopCustomers,
  getOrdersByStatus,
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
