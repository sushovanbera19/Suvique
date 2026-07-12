import {
  getCartItems,
  createOrder,
  createOrderItems,
  clearCart,
  getAllOrders,
  getOrderDetails,
  deleteOrderItems,
  deleteOrderById,
  updateOrder,
} from "../models/orderModel.js";

export const placeOrder = async (req, res) => {

  try {

    const userId = req.user.userId;

    const {

      address_id,
      payment_method

    } = req.body;

    const cartItems = await getCartItems(userId);

    if (cartItems.length === 0) {

      return res.json({

        success: false,
        message: "Cart is empty"

      });

    }

    let total = 0;

    cartItems.forEach(item => {

      total += item.base_price * item.quantity;

    });

    const orderId = await createOrder(

      userId,
      address_id,
      total,
      payment_method

    );

    await createOrderItems(

      orderId,
      cartItems

    );

    await clearCart(userId);

    res.json({

      success: true,
      message: "Order placed successfully"

    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message

    });

  }

};



export const fetchOrders=(req,res)=>{

    getAllOrders((err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        res.json({
            success:true,
            data:result
        });

    });

};

export const fetchOrderDetails=(req,res)=>{

    getOrderDetails(req.params.id,(err,result)=>{

        if(err){

            return res.status(500).json({
                success:false,
                message:err.message
            });

        }

        res.json({
            success:true,
            data:result
        });

    });

};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOrderItems(id);
    await deleteOrderById(id);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export const editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, order_status, payment_method } = req.body;
    await updateOrder(id, payment_status, order_status, payment_method);
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};