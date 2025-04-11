import Category from '../../models/category.js'

export const allCategories = async (req, res, next) => {
    const category=await Category.find({}).lean()
    res.send(category)
}

export const createCategory = async (req, res, next) => {

    const { name, description, subCategories } = req.body

    const category = await Category.create({
        name, description, subCategories
    })
    if (!category) {
        return res.status(400).json({ message: 'Category not created' })
    }
    res.send(category)
}