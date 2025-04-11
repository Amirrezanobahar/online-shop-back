import mongoose from 'mongoose';
import slugify from 'slugify';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'نام برند الزامی است'],
    unique: true,
    trim: true,
    maxlength: [50, 'نام برند نمی‌تواند بیشتر از ۵۰ کاراکتر باشد']
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, 'توضیحات نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد']
  },
  logo: {
    type: String,
    default: 'default-brand.jpg'
  },
  website: {
    type: String,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'لطفا یک آدرس معتبر وارد کنید']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Create brand slug from name
brandSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { 
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    locale: 'fa'
  });
  next();
});

// Query middleware
brandSchema.pre(/^find/, function(next) {
  this.sort('-createdAt');
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;   