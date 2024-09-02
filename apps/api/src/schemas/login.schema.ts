import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('email must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .when('$isEdit', (isEdit, schema) =>
      isEdit ? schema.optional() : schema.required('Password is required'),
    ),
});
