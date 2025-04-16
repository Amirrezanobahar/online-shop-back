import express from 'express'
import mongoose from 'mongoose'
import userRoute from './modules/user/user.router.js'
import cartRoute from './modules/cart/cart.router.js'
import productRoute from './modules/product/product.router.js'
import cors from 'cors'
import categoryRoute from './modules/category/category.router.js'
import brandRoute from './modules/brand/brand.router.js'
import eventRoute from './modules/event/event.router.js'
export const app = express()
import dotenv from "dotenv"
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files middleware ✅
app.use('/public', express.static('public'))

app.use('/user', userRoute)
app.use('/cart', cartRoute)
app.use('/product', productRoute)
app.use('/category', categoryRoute)
app.use('/brand', brandRoute)
app.use('/event', eventRoute)

app.use((req, res, next) => {
    res.status(404).send("Sorry, this route does not exist")
})

app.use((err, req, res, next) => {
    console.error(err.stack)
})

const PORT = process.env.PORT || 3000;


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
    }
}


connectToDB()

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});


