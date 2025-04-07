import express from "express";
import { auth } from "./../../middlewares/auth.js";
import {createProduct,getProducts} from './product.controller.js'


const router = express.Router()

router.get('/',getProducts)
router.post('/',createProduct)








export default router;