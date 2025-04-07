import { registerValidator } from "./user.validator.js"
import {model as userModel} from './../../models/user.js'
import mongoose from "mongoose"

import bcrypt from 'bcrypt'
export const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body

        const validator = await registerValidator.validate(req.body)
        if (validator.error) {
            return res.status(400).json({ message: validator.error.details[0].message })
        }

        const isExistUser = await userModel.findOne({ username, email })
        if (isExistUser) {
            return res.status(400).json({ message: "Username or Email already exist" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hashPassword,
        })

        // CORRECT: Call generateAuthToken on the user INSTANCE
        const token = user.generateAuthToken();  // No await needed unless it's async

        res.status(201).json({
            success: true,
            token,  // Now sending the token
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            res.send(err.message)
        }
        next(err);
    }
}