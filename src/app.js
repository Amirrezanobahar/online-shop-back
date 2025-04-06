import express from 'express'
import userRoute from './modules/user/user.router.js'

export const app = express()
app.use(express.json())
app.use(express.urlencoded())






app.use('/user', userRoute)


app.use((req, res, next) => {
    res.status(404).send("Sorry, this route does not exist")
})

app.use((err, req, res, next)=> {
    console.error(err.stack)
})