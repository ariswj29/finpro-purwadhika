import * as yup from 'yup';

export const branchSchemma = yup.object().shape({
  name: yup.string().required('name is required'),
  address: yup.string().required('address is required'),
  provinceId: yup.string().required('province is required'),
  cityId: yup.string().required('city is required'),
  postalCode: yup.string().required('postal code is required'),
  latitude: yup.string().required('latitude is required'),
  longitude: yup.string().required('longitude is required'),
  userId: yup.string().required('user is required'),
});
