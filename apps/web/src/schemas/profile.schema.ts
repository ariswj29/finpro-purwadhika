import * as yup from 'yup';

// Yup schema with proper type handling for files
const profileUpdateSchema = yup.object().shape({
  username: yup.string().min(3).max(50).notRequired(),
  email: yup.string().email().notRequired(),
  password: yup.string().min(8).notRequired(), // Password is optional but must meet the criteria if provided
  profilePicture: yup
    .mixed()
    .nullable()
    .notRequired() // Make profilePicture not required
    .test('fileFormat', 'Unsupported Format', (value: any) => {
      if (!value) return true; // No file uploaded, no need to validate format
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      return allowedFormats.includes(value.mimetype); // Check MIME type
    })
    .test('fileSize', 'File too large', (value: any) => {
      if (!value) return true; // No file uploaded, no need to validate size
      return value.size <= 1024 * 1024; // 1MB size limit
    }),
});

export default profileUpdateSchema;
