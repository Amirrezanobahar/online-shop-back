import express from "express";
import {sendCart,create,addToCart} from './cart.controller.js'
import { auth } from "./../../middlewares/auth.js";

const router = express.Router()

router.get('/',auth, sendCart)

router.post('/create',auth,create)

router.post('/addToCart',auth,addToCart)







export default router;