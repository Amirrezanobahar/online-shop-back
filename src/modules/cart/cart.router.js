import express from "express";
import { sendCart, create, addToCart } from './cart.controller.js';
import { removeFromCart, updateItemQuantity, clearCart } from './cart.controller.js';
import { auth } from "./../../middlewares/auth.js";

const router = express.Router();

router.get('/', auth, sendCart);

router.post('/create', auth, create);

router.post('/addToCart', auth, addToCart);

router.post('/removeFromCart', auth, removeFromCart);

router.post('/updateItemQuantity', auth, updateItemQuantity);

router.post('/clearCart', auth, clearCart);

export default router;
