import * as yup from 'yup';

export const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
    .when('$isEdit', (isEdit, schema) =>
      isEdit ? schema.optional() : schema.required('Password is Required'),
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Password tidak cocok'),
});
