import * as yup from 'yup';

const profileUpdateSchema = yup.object().shape({
  username: yup.string().min(3).max(50).notRequired(),
  email: yup.string().email().notRequired(),
  password: yup.string().min(8).notRequired(),
  profilePicture: yup
    .mixed()
    .nullable()
    .notRequired()
    .test('fileFormat', 'Unsupported Format', (value: any) => {
      if (!value) return true;
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      return allowedFormats.includes(value.mimetype);
    })
    .test('fileSize', 'File too large', (value: any) => {
      if (!value) return true;
      return value.size <= 1024 * 1024;
    }),
});

export default profileUpdateSchema;
