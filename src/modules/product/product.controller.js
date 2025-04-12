import Product from './../../models/product.js';
import mongoose from 'mongoose';

// هندلر خطای یکپارچه
const handleError = (res, error, statusCode = 400) => {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ errors });
  }
  res.status(statusCode).json({ error: error.message });
};

// ایجاد محصول جدید با اعتبارسنجی
export const createProduct = async (req, res,next) => {
  //todo validator
  try {
    // const requiredFields = ['name', 'price', 'category'];
    // const missingFields = requiredFields.filter(field => !req.body[field]);
    
    // if (missingFields.length > 0) {
    //   return res.status(400).json({
    //     error: `فیلدهای اجباری: ${missingFields.join(', ')}`
    //   });
    // }

    // if (req.body.price < 0) {
    //   return res.status(400).json({ error: 'قیمت نمی‌تواند منفی باشد' });
    // }

    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// به‌روزرسانی محصول
export const updateProduct = async (req, res) => {
  console.log('hello world');
  
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'price', 'description', 'stock', 'isFeatured', 'isNewProduct'];
    // const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    // if (!isValidOperation) {
    //   return res.status(400).json({ error: 'بروزرسانی غیرمجاز' });
    // }

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'محصول یافت نشد' });
    }

    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

// بقیه توابع بدون تغییر (getProduct, allProducts, deleteProduct)

// دریافت تمام محصولات با قابلیت صفحه‌بندی و فیلتر
export const allProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, featured } = req.query;
    const query = featured ? { isFeatured: featured === 'true' } : {};

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Product.countDocuments(query);

    res.json(products);
  } catch (error) {
    handleError(res, error, 500);
  }
};

// دریافت محصول با ID
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('brand', 'name')
      .lean();

    if (!product) {
      return res.status(404).json({ error: 'محصول یافت نشد' });
    }
    
    res.json(product);
  } catch (error) {
    handleError(res, error);
  }
};

// حذف محصول
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'محصول یافت نشد' });
    }
    
    res.json({ message: 'محصول با موفقیت حذف شد', deletedProduct: product });
  } catch (error) {
    handleError(res, error);
  }
};