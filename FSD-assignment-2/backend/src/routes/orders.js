const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Validation rules for order creation
const orderValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required').isLength({ max: 100 }),
  body('customerPhone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]{7,15}$/)
    .withMessage('Invalid phone number'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId').notEmpty().withMessage('Menu item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 20 })
    .withMessage('Quantity must be between 1 and 20'),
  body('deliveryType').optional().isIn(['dine-in', 'takeaway']).withMessage('Invalid delivery type'),
  body('specialInstructions').optional().trim().isLength({ max: 300 }),
];

// POST /api/orders - Create a new order
router.post('/', orderValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { customerName, customerPhone, items, specialInstructions, deliveryType } = req.body;

    // Fetch all menu items from DB (server-side price calculation)
    const menuItemIds = items.map((i) => i.menuItemId);
    
    // Validate all IDs are valid ObjectIds
    for (const id of menuItemIds) {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ success: false, message: `Invalid menu item ID: ${id}` });
      }
    }

    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } });

    const menuMap = {};
    menuItems.forEach((m) => {
      menuMap[m._id.toString()] = m;
    });

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = menuMap[item.menuItemId];
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item not found: ${item.menuItemId}` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ success: false, message: `"${menuItem.name}" is currently unavailable` });
      }

      const qty = parseInt(item.quantity, 10);
      const subtotal = menuItem.price * qty;
      totalAmount += subtotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: qty,
        subtotal,
      });
    }

    const order = new Order({
      customerName,
      customerPhone,
      items: orderItems,
      totalAmount,
      specialInstructions: specialInstructions || '',
      deliveryType: deliveryType || 'dine-in',
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let order;
    // Support lookup by MongoDB ID or order number
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id.toUpperCase() });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

module.exports = router;
