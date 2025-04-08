import { registerValidator } from "./user.validator.js"
import { model as userModel } from './../../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


export const register = async (req, res, next) => {
    console.log('hello ');

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



export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "نام کاربری و رمز عبور الزامی هستند"
            });
        }

        // Find user with proper query object
        const user = await userModel.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        }).select('+password').lean();

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "نام کاربری یا ایمیل اشتباه است"
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "رمز عبور اشتباه است"
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // Remove sensitive data before sending response
        delete user.password;

        res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'خطای سرور. لطفاً دوباره تلاش کنید'
        });
    }
};

export const userRole = async (req, res, next)=>{
  
    try{
        const userID = req.user._id

        if (!userID) {
            return res.status(401).json({ success: false, message: 'شما باید وارد شوید' })
        }
    
        const user = await userModel.findById(userID).lean()
        if (!user) {
            return res.status(401).json({ success: false, message: ' شما باید وارد شوید' })
        }
        res.send({ role: user.role })
    }catch(err){
        next(err)
    }    
}