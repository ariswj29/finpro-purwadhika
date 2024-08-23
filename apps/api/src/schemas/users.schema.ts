import * as yup from 'yup';

export const usersSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  roleId: yup.string().required('Role is required'),
  email: yup
    .string()
    .email('Email must be a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .when('$isEdit', (isEdit, schema) =>
      isEdit ? schema.optional() : schema.required('Password is required'),
    ),
  address: yup.string().required('Address is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
});
