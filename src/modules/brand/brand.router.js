import express from 'express'
import { deleteBrand,getAllBrands,getBrand,createBrand } from './brand.controller.js'

const router =new express.Router()

router.get('/',getAllBrands)
router.get('/:id',getBrand)
router.post('/',createBrand)
router.post('/:id',deleteBrand)

export default router;