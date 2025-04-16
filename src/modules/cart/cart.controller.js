import { model as cartModel } from "../../models/cart.js"
import  productModel from './../../models/product.js'

export const sendCart = async (req, res, next) => {

    try {
        const userID = req.user._id

        const cart = await cartModel.findOne({ user: userID }, '-__v').populate('items', '-__v').populate('user', '-__v').lean()

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" })
        }

        res.send({ cart })

    } catch (err) {
        next(err)
    }

}



export const create = async (req, res, next) => {

    try {

        const userID = req.user._id

        const cart = await cartModel.create({ user: userID })

        if (!cart) {
            return res.status(400).send({ message: 'Cart not created' })
        }
        res.send({ message: 'Cart created', cart: cart._id })

    } catch (err) {
        next(err)
    }

}



export const addToCart = async (req, res, next) => {
    
    try {
      const { productId, quantity, color, size } = req.body;
  
      // پیدا کردن محصول
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // پیدا کردن سبد خرید کاربر
      const cart = await cartModel.findOne({ user: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // اضافه کردن محصول به سبد خرید
      await cart.addItem(productId, quantity, color, size, product.price);
  
      // بازگشت سبد خرید جدید
      res.json({ message: "Product added to cart", cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// حذف یک آیتم از سبد خرید
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId, color, size } = req.body;

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        await cart.removeItem(productId, color, size);

        res.json({ message: "Item removed from cart", cart });
    } catch (error) {
        next(error);
    }
};


// آپدیت تعداد آیتم
export const updateItemQuantity = async (req, res, next) => {
    try {
        const { productId, quantity, color, size } = req.body;

        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        await cart.updateItemQuantity(productId, quantity, color, size);

        res.json({ message: "Cart item quantity updated", cart });
    } catch (error) {
        next(error);
    }
};


// حذف کل سبد خرید (مثلاً بعد از پرداخت موفق یا دستی)
export const clearCart = async (req, res, next) => {
    try {
        const cart = await cartModel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: "Cart cleared", cart });
    } catch (error) {
        next(error);
    }
};
