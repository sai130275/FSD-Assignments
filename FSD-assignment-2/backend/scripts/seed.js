require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db';

const sampleMenuItems = [
  // Starters
  {
    name: 'Crispy Calamari',
    description: 'Golden-fried calamari rings served with lemon aioli and marinara dipping sauce',
    price: 280,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=400',
    isAvailable: true,
    preparationTime: 12,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled in a tandoor oven with spiced yogurt',
    price: 240,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d6?w=400',
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: true,
    isSpicy: true,
  },
  {
    name: 'Soup of the Day',
    description: 'Chef\'s daily special soup served with crusty bread rolls',
    price: 160,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Chicken Wings',
    description: 'Crispy buffalo wings tossed in tangy hot sauce, served with blue cheese dip',
    price: 320,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
    isAvailable: true,
    preparationTime: 18,
    isVegetarian: false,
    isSpicy: true,
  },
  // Mains
  {
    name: 'Grilled Salmon',
    description: 'Atlantic salmon fillet grilled to perfection with herbs, lemon butter sauce and seasonal vegetables',
    price: 680,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    isAvailable: true,
    preparationTime: 25,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Butter Chicken',
    description: 'Classic North Indian curry with tender chicken in a rich, creamy tomato-based sauce',
    price: 380,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Vegetable Biryani',
    description: 'Aromatic basmati rice layered with fresh vegetables and whole spices, served with raita',
    price: 280,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?w=400',
    isAvailable: true,
    preparationTime: 30,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Ribeye Steak',
    description: '250g prime cut ribeye grilled to your preference, served with fries and garlic butter',
    price: 950,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400',
    isAvailable: true,
    preparationTime: 30,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic wood-fired pizza with San Marzano tomatoes, fresh mozzarella and basil',
    price: 360,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in a rich buttery tomato gravy, best with naan',
    price: 240,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: true,
    isSpicy: false,
  },
  // Sides
  {
    name: 'Garlic Naan',
    description: 'Freshly baked naan bread with garlic and butter',
    price: 60,
    category: 'Sides',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400',
    isAvailable: true,
    preparationTime: 8,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Steamed Rice',
    description: 'Perfectly cooked basmati rice',
    price: 80,
    category: 'Sides',
    imageUrl: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400',
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'French Fries',
    description: 'Golden crispy fries seasoned with sea salt and herbs',
    price: 120,
    category: 'Sides',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
  },
  // Desserts
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a gooey molten centre, served with vanilla ice cream',
    price: 240,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    isAvailable: true,
    preparationTime: 15,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup, served warm',
    price: 120,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1666274618-e9a66a39a73c?w=400',
    isAvailable: true,
    preparationTime: 10,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
    price: 280,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
  },
  // Beverages
  {
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with fresh Alphonso mangoes',
    price: 120,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=400',
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Chilled soda with freshly squeezed lime juice, served sweet or salted',
    price: 80,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    isAvailable: true,
    preparationTime: 3,
    isVegetarian: true,
    isSpicy: false,
  },
  {
    name: 'Filter Coffee',
    description: 'South Indian style filter coffee served hot with frothed milk',
    price: 80,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    isAvailable: true,
    preparationTime: 5,
    isVegetarian: true,
    isSpicy: false,
  },
  // Specials
  {
    name: "Chef's Tasting Menu",
    description: 'A curated 5-course experience showcasing the best of our seasonal menu',
    price: 1500,
    category: 'Specials',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    isAvailable: true,
    preparationTime: 60,
    isVegetarian: false,
    isSpicy: false,
  },
  {
    name: 'Weekend Brunch Special',
    description: 'All-you-can-eat brunch with eggs, pancakes, fresh fruit and beverages',
    price: 650,
    category: 'Specials',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400',
    isAvailable: true,
    preparationTime: 20,
    isVegetarian: true,
    isSpicy: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const item of sampleMenuItems) {
      const exists = await MenuItem.findOne({ name: item.name });
      if (!exists) {
        await MenuItem.create(item);
        console.log(`  ✅ Added: ${item.name}`);
        insertedCount++;
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${item.name}`);
        skippedCount++;
      }
    }

    console.log(`\nSeed complete! Inserted: ${insertedCount} | Skipped: ${skippedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
