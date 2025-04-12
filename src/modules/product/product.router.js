import express from "express";
import { auth } from "./../../middlewares/auth.js";
import {createProduct,deleteProduct,updateProduct,getProduct,allProducts} from './product.controller.js'


const router = express.Router()


router.get('/',allProducts)
router.get('/:id',getProduct)
router.delete('/:id',deleteProduct)
router.put('/:id',updateProduct)
router.post('/',createProduct)








export default router;