import express from 'express'
import {allCategories,createCategory} from './category.controller.js'
const router = new express.Router()

router.get('/', allCategories)
router.post('/',createCategory)


export default router;