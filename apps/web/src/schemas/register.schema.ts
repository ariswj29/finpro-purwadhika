import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup
    .string()
    .email('email must be valid')
    .required('email is required'),
});
