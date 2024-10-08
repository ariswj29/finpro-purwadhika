import * as yup from 'yup';

export const inventorySchema = yup.object().shape({
  stock: yup.number().required('Stock is required'),
  productId: yup.number().required('Product is required'),
  branchId: yup.number().required('Branch is required'),
});
