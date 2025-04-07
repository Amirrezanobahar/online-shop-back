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



export const addToCart = async (req, res, next)=>{

    try {
        const { productId, quantity, color, size } = req.body;
        const product = await productModel.findById(productId);
        console.log(product);
        
        const cart = await cartModel.findOne({ user: req.user._id });
        await cart.addItem(productId, quantity, color, size, product.price);
        
        res.json(cart);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}