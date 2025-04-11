import Brand from '../../models/brand.js';


export const createBrand = (async (req, res, next) => {
  // 1) Check for existing brand
  const existingBrand = await Brand.findOne({ name: req.body.name });
  if (existingBrand) {
    return next(new AppError('برندی با این نام قبلا ثبت شده است', 400));
  }

  // 2) Handle logo upload
  if (req.file) {
    req.body.logo = req.file.filename;
  }

  // 3) Create new brand
  const newBrand = await Brand.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      brand: newBrand
    }
  });
});

export const getAllBrands = (async (req, res, next) => {
  // 1) Filtering, Sorting, Pagination
  const brand = await Brand.find({}).lean()

  if (!brand) {
    res.status(404).send({ message: "brand not found!!" })
  }

  res.status(200).json(brand);
});

export const getBrand = (async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return next(new AppError('برندی با این شناسه یافت نشد', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      brand
    }
  });
});

export const updateBrand = (async (req, res, next) => {
  // 1) Check if logo is being updated
  if (req.file) {
    req.body.logo = req.file.filename;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedBrand) {
    return next(new AppError('برندی با این شناسه یافت نشد', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      brand: updatedBrand
    }
  });
});

export const deleteBrand = (async (req, res, next) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new AppError('برندی با این شناسه یافت نشد', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});