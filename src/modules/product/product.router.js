import express from "express";
import { auth } from "./../../middlewares/auth.js";
import {createProduct,getProduct,allProducts} from './product.controller.js'


const router = express.Router()


router.get('/',allProducts)
router.get('/:id',getProduct)
router.post('/',createProduct)








export default router;