import { registerValidator } from "./user.validator.js";
import { model as userModel } from './../../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isValidObjectId } from "mongoose";

// Register
export const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;

        const validator = await registerValidator.validate(req.body);
        if (validator.error) {
            return res.status(400).json({ message: validator.error.details[0].message });
        }

        const isExistUser = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (isExistUser) {
            return res.status(400).json({ message: "Username or Email already exist" });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hashPassword,
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        next(err);
    }
};

// Login
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "نام کاربری و رمز عبور الزامی هستند"
            });
        }

        const user = await userModel.findOne({
            $or: [{ username }, { email: username }]
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "نام کاربری یا ایمیل اشتباه است"
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "رمز عبور اشتباه است"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        user.password = undefined;

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

// Get user role
export const userRole = async (req, res, next) => {
    try {
        const userID = req.user._id;

        if (!userID) {
            return res.status(401).json({ success: false, message: 'شما باید وارد شوید' });
        }

        const user = await userModel.findById(userID).lean();
        if (!user) {
            return res.status(401).json({ success: false, message: 'شما باید وارد شوید' });
        }

        res.status(200).json({ success: true, role: user.role });
    } catch (err) {
        next(err);
    }
};

// Get all users
export const allUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({}).lean();

        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        next(err);
    }
};

// Delete user
export const deleteUser = async (req, res, next) => {
    try {
        const userID = req.params.id;

        if (!isValidObjectId(userID)) {
            return res.status(400).json({ success: false, message: "شناسه کاربر معتبر نیست" });
        }
        // بررسی مجوزهای کاربر فعلی
        if (req.user.role !== 'ADMIN' && userId !== currentUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "شما مجوز به‌روزرسانی این کاربر را ندارید"
            });
        }

        const user = await userModel.findOneAndDelete({ _id: userID });

        if (!user) {
            return res.status(404).json({ success: false, message: "کاربر پیدا نشد" });
        }

        res.status(200).json({
            success: true,
            message: "کاربر با موفقیت حذف شد",
            user
        });
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req, res, next) => {
    console.log('hello world');
    
    try {
        const userId = req.params.id;
        const updates = req.body;
        const currentUser = req.user; // کاربر فعلی از طریق احراز هویت

        // اعتبارسنجی شناسه کاربر
        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: "شناسه کاربر معتبر نیست"
            });
        }

        // جلوگیری از به روزرسانی خودتان (اگر نیاز باشد)
        if (userId === currentUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "شما نمی‌توانید اطلاعات حساب خود را از این طریق به‌روزرسانی کنید"
            });
        }

        // // اعتبارسنجی داده‌های ورودی
        // const { error } = await updateUserValidator.validate(updates);
        // if (error) {
        //     return res.status(400).json({
        //         success: false,
        //         message: error.details[0].message
        //     });
        // }

        // فیلدهای غیرقابل تغییر
        const restrictedFields = ['password', 'email', 'username'];
        restrictedFields.forEach(field => delete updates[field]);

        // بررسی وجود کاربر
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "کاربر مورد نظر یافت نشد"
            });
        }

        // بررسی مجوزهای کاربر فعلی
        if (currentUser.role !== 'ADMIN' && userId !== currentUser._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "شما مجوز به‌روزرسانی این کاربر را ندارید"
            });
        }

        // اگر نقش در حال تغییر است، بررسی مجوزهای اضافی
        if (updates.role && currentUser.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "فقط مدیران می‌توانند نقش کاربران را تغییر دهند"
            });
        }

        console.log(updates);
        
        // به‌روزرسانی کاربر
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updates,
            {
                new: true,
                runValidators: true,
                select: '-password' // عدم بازگرداندن رمز عبور
            }
        );

        return res.status(200).json({
            success: true,
            message: "اطلاعات کاربر با موفقیت به‌روزرسانی شد",
            user: updatedUser
        });

    } catch (err) {
        console.error('Error updating user:', err);
        return next(err);
    }
};