import Event from '../../models/event.js';

// دریافت لیست رویدادها
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'مشکلی در دریافت داده‌ها به وجود آمده است', error });
  }
};

// افزودن یک رویداد جدید
export const createEvent = async (req, res) => {
  try {
    const { title, date, status } = req.body;
    const image = req.file.filename; // مسیر فایل تصویر آپلود شده

    const newEvent = new Event({
      title,
      date,
      status,
      image,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'مشکلی در افزودن رویداد به وجود آمده است', error });
  }
};

// حذف یک رویداد
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'رویداد یافت نشد' });
    }

    res.status(200).json({ message: 'رویداد با موفقیت حذف شد' });
  } catch (error) {
    res.status(500).json({ message: 'مشکلی در حذف رویداد به وجود آمده است', error });
  }
};

// به‌روزرسانی یک رویداد
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, status } = req.body;

    // آماده‌سازی اطلاعات برای به‌روزرسانی
    const updatedData = { title, date, status };

    // اگر تصویر جدید آپلود شده باشد، مسیر آن اضافه شود
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const event = await Event.findByIdAndUpdate(id, updatedData, { new: true });

    if (!event) {
      return res.status(404).json({ message: 'رویداد یافت نشد' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'مشکلی در به‌روزرسانی رویداد به وجود آمده است', error });
  }
};
