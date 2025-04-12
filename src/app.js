import express from 'express'
import userRoute from './modules/user/user.router.js'
import cartRoute from './modules/cart/cart.router.js'
import productRoute from './modules/product/product.router.js'
import cors from 'cors'
import categoryRoute from './modules/category/category.router.js'
import brandRoute from './modules/brand/brand.router.js'

export const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

// Static files middleware ✅
app.use('/public', express.static('public'))

app.use('/user', userRoute)
app.use('/cart', cartRoute)
app.use('/product', productRoute)
app.use('/category', categoryRoute)
app.use('/brand', brandRoute)

app.use((req, res, next) => {
    res.status(404).send("Sorry, this route does not exist")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
})
