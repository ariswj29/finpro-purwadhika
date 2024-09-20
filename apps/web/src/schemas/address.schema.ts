import * as yup from 'yup';

export const addressSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  address: yup.string().required('address is required'),
  cityId: yup.string().required('city is required'),
  provinceId: yup.string().required('province is required'),
  postalCode: yup.string().required('postal code required'),
});
