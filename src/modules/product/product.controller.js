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
export const getProduct = async (req, res, next) => {
  try {

    const { id } = req.params

    const product = await Product.findById(id).lean()

    if (!product) {
      return res.status(404).send({ error: ' product not found' })
    }
    res.send(product);

  } catch (error) {
    next(error)
  }
};