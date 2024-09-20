import * as yup from 'yup';

export const productsSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  price: yup.number().required('Price is required'),
  image: yup.string().required('Image is required'),
  categoryId: yup.string().required('Category is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string(),
});
