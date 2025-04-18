import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'محصول الزامی است']
    },
    quantity: {
      type: Number,
      required: [true, 'تعداد الزامی است'],
      default: 1,
      min: [1, 'تعداد نمی‌تواند کمتر از ۱ باشد'],
      max: [100, 'تعداد نمی‌تواند بیشتر از ۱۰۰ باشد']
    },
    color: {
      type: String,
      required: [true, 'رنگ الزامی است']
    },
    size: {
      type: String,
      required: [true, 'سایز الزامی است']
    },
    price: {
      type: Number,
      required: [true, 'قیمت الزامی است']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  });

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'کاربر الزامی است'],
        unique: true
      },
      items: [cartItemSchema],
      totalPrice: {
        type: Number,
        default: 0
      },
      totalItems: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
})

cartSchema.methods.addItem = function (productId, quantity, color, size, price) {
  const existingItem = this.items.find(item => item.product.toString() === productId && item.color === color && item.size === size);
  
  if (existingItem) {
    existingItem.quantity += quantity; // افزایش تعداد محصول
  } else {
    this.items.push({ product: productId, quantity, color, size, price });
  }

  return this.save(); // ذخیره‌سازی سبد خرید
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;

cartSchema.methods.addItem = async function(productId, quantity, color, size, price) {
    const existingItem = this.items.find(item => 
      item.product.toString() === productId && 
      item.color === color && 
      item.size === size
    );
  
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product: productId, quantity, color, size, price });
    }
  
    return await this.save();
  };

export const model = mongoose.model('Cart', cartSchema)