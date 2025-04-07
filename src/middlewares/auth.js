import jwt from 'jsonwebtoken'
import { model as userModel } from '../models/user.js'
import mongoose from 'mongoose'

export const auth = async (req, res, next) => {
    
    const authHeader = req.header('Authorization');
    if (!authHeader ) {
        return res.status(401).json({
            error: 'لطفاً وارد حساب کاربری خود شوید',
            showAlert: true,
            alertConfig: {
                title: 'خطای احراز هویت',
                text: 'لطفاً برای دسترسی به این صفحه وارد حساب کاربری خود شوید',
                icon: 'warning'
            }
        });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await userModel.findById(decoded.id).select('-password').lean();
            
            if (!user) {
                return res.status(401).json({
                    error: 'کاربر یافت نشد',
                    showAlert: true,
                    alertConfig: {
                        title: 'خطای احراز هویت',
                        text: 'حساب کاربری شما یافت نشد',
                        icon: 'error'
                    }
                });
            }
    
            req.user = user;
            next();
    } catch (err) {
        let errorMessage = 'خطای احراز هویت';
        
        if (err.name === 'TokenExpiredError') {
            errorMessage = 'توکن شما منقضی شده است. لطفاً مجدداً وارد شوید';
        } else if (err.name === 'JsonWebTokenError') {
            errorMessage = 'توکن نامعتبر است';
        }

        return res.status(401).json({
            error: errorMessage,
            showAlert: true,
            alertConfig: {
                title: 'خطای احراز هویت',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'ورود مجدد',
                confirmButtonColor: '#ef394e'
            }
        });
    }

}