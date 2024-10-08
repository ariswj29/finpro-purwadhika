import * as yup from 'yup';

export const orderSchema = yup.object().shape({
  addressId: yup.string().required('Address is required'),
  paymentMethod: yup.string().required('Payment Method is required'),
  courier: yup.string().required('Courier is required'),
});
