import yup from 'yup'

export const registerValidator = yup.object().shape({
    email: yup.string().required('ایمیل الزامی است').email('ایمیل معتبر وارد کنید').max(100, 'ایمیل نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد'),
    password:yup.string().required('رمز عبور الزامی است').min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
    confirmPassword: yup.string().required('تکرار رمز عبور الزامی است').oneOf([yup.ref('password'), null], 'رمزهای عبور باید یکسان باشند'),
    username:yup.string().required('نام کاربری اجباری است').min(3,'نام کاربری نمیتواند کمتر از 3 کاراکتر باشد').max(32,' نام کاربری نمیتواند بیشتر از 32 کاراکتر باشد'),
})