import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  // اطلاعات پایه
  name: {
    type: String,
    required: [true, 'نام دسته‌بندی الزامی است'],
    trim: true,
    unique: true,
    maxlength: [50, 'نام دسته‌بندی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد']
  },

  // تصاویر
  image: {
    url: String,
    altText: String
  },

  // ویژگی‌های خاص
  isFeatured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0,
    min: 0
  },

  // زیردسته‌بندی‌ها
  subCategories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true
    }
  }],

  // متادیتا
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
});

// Middleware برای ایجاد slug خودکار
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').toLowerCase();
  }

  // ایجاد slug برای زیردسته‌ها
  this.subCategories.forEach(subCat => {
    if (!subCat.slug) {
      subCat.slug = subCat.name.replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').toLowerCase();
    }
  });

  next();
});

// ارتباط با محصولات
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

// محاسبه تعداد محصولات
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// ایندکس‌گذاری برای جستجو
categorySchema.index({ name: 'text', description: 'text', 'subCategories.name': 'text' });

const Category = mongoose.model('Category', categorySchema);
export default Category;