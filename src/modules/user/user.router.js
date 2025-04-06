import express from 'express'
import {register} from './../user/user.controller.js'

const router = express.Router()

router.route('/register').post(register)







export default router;