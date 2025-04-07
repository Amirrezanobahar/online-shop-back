import express from 'express'
import {register,login} from './../user/user.controller.js'
import { auth } from '../../middlewares/auth.js'

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)







export default router;