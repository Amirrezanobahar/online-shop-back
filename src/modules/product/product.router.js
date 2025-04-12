import express from "express";
import { auth } from "./../../middlewares/auth.js";
import {createProduct,deleteProduct,updateProduct,getProduct,allProducts} from './product.controller.js'
import upload from '../../middlewares/upload.js'


const router = express.Router()


router.get('/',allProducts)
router.get('/:id',getProduct)
router.delete('/:id',deleteProduct)
router.put('/:id',upload,updateProduct)
router.post('/',upload,createProduct)








export default router;