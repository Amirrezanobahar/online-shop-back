import Product from './../../models/product.js';

// ایجاد محصول جدید
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// دریافت محصولات با فیلتر
export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = minPrice;
      if (maxPrice) query.finalPrice.$lte = maxPrice;
    }

    const products = await Product.find(query)
      .sort(sort || '-createdAt')
      .populate('brand category');

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};