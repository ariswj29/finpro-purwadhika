import * as yup from 'yup';

export const verifyResetPasssword = yup.object().shape({
  email: yup
    .string()
    .email('email must be valid')
    .required('email is required'),
});
