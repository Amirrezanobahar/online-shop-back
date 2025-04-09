import Product from './../../models/product.js';

// ایجاد محصول جدید
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    // todo validation 
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

export const allProducts = async (req, res, next) => {
  try {

    const product = await Product.find({}).lean()

    if (!product) {
      return res.status(404).send({ error: 'not exist any product' })
    }
    res.send(product);

  } catch (error) {
    next(error)
  }
};