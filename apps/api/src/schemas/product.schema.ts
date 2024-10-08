import * as yup from 'yup';

const ProductSchema = yup.object().shape({
  slug: yup.string().notRequired(),
  name: yup.string().required('Name is required'),
  description: yup.string().min(8).notRequired(),
  price: yup.number().required('Price is required'),
  categoryId: yup.number().required('Category is required'),
  image: yup
    .mixed()
    .nullable()
    .notRequired()
    .test('fileFormat', 'Unsupported Format', (value: any) => {
      if (!value) return true;
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
      return allowedFormats.includes(value.mimetype);
    })
    .test('fileSize', 'File too large', (value: any) => {
      if (!value) return true;
      return value.size <= 1024 * 1024;
    }),
});

export default ProductSchema;
