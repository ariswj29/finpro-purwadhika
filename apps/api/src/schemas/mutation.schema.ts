import * as yup from 'yup';

export const mutationSchema = yup.object().shape({
  stockRequest: yup.number(),
  stockProcess: yup.number(),
  productId: yup.number().required('Product is required'),
  sourceBranchId: yup.number().required('Source branch is required'),
  destinationBranchId: yup.number().required('Destination branch is required'),
  note: yup.string(),
});
