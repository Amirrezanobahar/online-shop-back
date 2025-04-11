import express from 'express'
import { getAllBrands,getBrand,createBrand } from './brand.controller.js'

const router =new express.Router()

router.get('/',getAllBrands)
router.get('/:id',getBrand)
router.post('/',createBrand)

export default router;