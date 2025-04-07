import express from "express";
import {sendCart,create} from './cart.controller.js'
import { auth } from "./../../middlewares/auth.js";

const router = express.Router()

router.get('/',auth, sendCart)

router.post('/create',auth,create)





export default router;