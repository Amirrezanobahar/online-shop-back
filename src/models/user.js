import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'ایمیل الزامی است'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'لطفا یک ایمیل معتبر وارد کنید']
    },
    password: {
        type: String,
        required: [true, 'رمز عبور الزامی است'],
        minlength: [8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'],
        select: false // عدم نمایش در خروجی‌های پیش‌فرض
    },
    username: {
        type: String,
        required: [true, 'نام کاربری تلفن الزامی است'],
        unique: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true
    },
    addresses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }], // آرایه‌ای از آدرس‌ها
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        color: String,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
});

// middleware برای آپدیت تاریخ بروزرسانی
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
})

userSchema.methods.generateAuthToken = function() {
    return jwt.sign(
      { 
        id: this._id,
        email: this.email,
        role: this.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  };
// Add this before export
console.log('Methods attached:', Object.keys(userSchema.methods))
export const model = mongoose.model('User', userSchema)