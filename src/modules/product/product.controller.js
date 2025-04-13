import Product from './../../models/product.js';
import mongoose from 'mongoose';

// هندلر خطای یکپارچه
const handleError = (res, error, statusCode = 400) => {
  console.error(error); // بهتر برای دیباگ
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({ errors });
  }
  res.status(statusCode).json({ error: error.message });
};

// پارس کردن body ورودی (json یا string)
const parseRequestBody = (body) => {
  return Object.entries(body).reduce((acc, [key, value]) => {
    try {
      acc[key] = JSON.parse(value);
    } catch {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// آماده‌سازی تصاویر
const prepareImages = (files = [], altTexts = []) => {
  const altTextArray = Array.isArray(altTexts) ? altTexts : altTexts ? [altTexts] : [];
  return files.map((file, index) => ({
    url: `/uploads/products/${file.filename}`,
    altText: altTextArray[index] || `تصویر محصول ${index + 1}`,
    isMain: index === 0
  }));
};

// ایجاد محصول جدید
export const createProduct = async (req, res) => {
  try {
    const parsedBody = parseRequestBody(req.body);
    const images = prepareImages(req.files, req.body.altTexts);

    const productData = {
      ...parsedBody,
      images,
      price: Number(parsedBody.price),
      stock: Number(parsedBody.stock),
      discount: Number(parsedBody.discount),
      sold: Number(parsedBody.sold),
      expiryDate: parsedBody.expiryDate ? new Date(parsedBody.expiryDate).toISOString() : null,
      colors: parsedBody.colors?.map(color => ({
        ...color,
        weight: {
          value: Number(color.weight?.value || 0),
          unit: color.weight?.unit || 'g'
        }
      })) || []
    };

    const product = await Product.create(productData);

    res.status(201).json({
      message: 'محصول با موفقیت ایجاد شد',
      product
    });
  } catch (error) {
    handleError(res, error);
  }
};

// به‌روزرسانی محصول
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedBody = parseRequestBody(req.body);
    const images = prepareImages(req.files, req.body.altTexts);

    // اگر فایل تصویر جدید آپلود شده بود، به body اضافه کن
    if (images.length > 0) {
      parsedBody.images = images;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      parsedBody,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'محصول یافت نشد' });
    }

    res.json({
      message: 'محصول با موفقیت به‌روزرسانی شد',
      product: updatedProduct
    });
  } catch (error) {
    handleError(res, error);
  }
};

// دریافت تمام محصولات با قابلیت صفحه‌بندی و فیلتر
export const allProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, featured } = req.query;
    const query = featured ? { isFeatured: featured === 'true' } : {};

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('brand')
      .populate('category')
      .lean();

    const count = await Product.countDocuments(query);

    res.send(products);
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
    res.send(product);
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

    res.json({
      message: 'محصول با موفقیت حذف شد',
      deletedProduct: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const specialOffers = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'discount', order = 'desc' } = req.query;

    const query = {
      discount: { $gte: 10 }, // حداقل ۱۰ درصد تخفیف
      stock: { $gt: 0 } // محصولاتی که موجودی دارند
    };

    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;

    const offers = await Product.find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('brand', 'name')
      .populate('category', 'name')
      .lean();

    const total = await Product.countDocuments(query);

    res.send(offers);
  } catch (error) {
    handleError(res, error, 500);
  }
};
