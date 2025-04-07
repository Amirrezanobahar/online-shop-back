import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // اطلاعات پایه
  name: {
    type: String,
    required: [true, 'نام محصول الزامی است'],
    trim: true,
    maxlength: [100, 'نام محصول نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد']
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'برند الزامی است']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'دسته‌بندی الزامی است']
  },
  subCategory: {
    type: String,
    enum: ['رژلب', 'خط چشم', 'کرم پودر', 'ریمل', 'سایه چشم']
  },

  // اطلاعات قیمت و موجودی
  price: {
    type: Number,
    required: [true, 'قیمت الزامی است'],
    min: [1000, 'قیمت نمی‌تواند کمتر از ۱,۰۰۰ تومان باشد']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  sold: {
    type: Number,
    default: 0
  },

  // ویژگی‌های محصول
  colors: [{
    name: String,
    hexCode: String
  }],
  sizes: [String],
  skinTypes: {
    type: [String],
    enum: ['چرب', 'خشک', 'مختلط', 'حساس']
  },
  ingredients: [String],
  expiryDate: Date,
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'ml'],
      default: 'g'
    }
  },

  // محتوای توصیفی
  description: {
    type: String,
    required: [true, 'توضیحات محصول الزامی است']
  },
  features: [String],
  howToUse: String,
  warnings: String,

  // رسانه‌ها
  images: [{
    url: String,
    altText: String,
    isMain: Boolean
  }],
  videoUrl: String,

  // امتیازدهی و نظرات
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // متادیتا
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// محاسبه قیمت پس از تخفیف
productSchema.virtual('finalPrice').get(function() {
  return this.price * (100 - this.discount) / 100;
});

// ارتباط با نظرات
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product'
});

// ایندکس‌گذاری برای جستجو
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// middleware برای آپدیت خودکار
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;