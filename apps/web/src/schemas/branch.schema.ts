import * as yup from 'yup';

export const branchSchemma = yup.object().shape({
  name: yup.string().required('name is required'),
  address: yup.string().required('address is required'),
  provinceId: yup.string().required('province is required'),
  cityId: yup.string().required('city is required'),
  postalCode: yup.string().required('postal code is required'),
  latitude: yup.string(),
  longitude: yup.string(),
  userId: yup.string().required('user is required'),
});
