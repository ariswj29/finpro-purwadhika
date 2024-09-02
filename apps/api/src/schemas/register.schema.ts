import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('email must be valid')
    .required('email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .when('$isEdit', (isEdit, schema) =>
      isEdit ? schema.optional() : schema.required('Password is Required'),
    ),
});
