const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// GET /api/menu - Fetch all available menu items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
  }
});

// GET /api/menu/categories - Fetch available categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET /api/menu/:id - Fetch a single menu item
router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid item ID' });
    }
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu item' });
  }
});

module.exports = router;
