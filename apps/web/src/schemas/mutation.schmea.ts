import * as yup from 'yup';

export const mutationSchema = yup.object().shape({
  stockRequest: yup.number(),
  stockProcess: yup
    .number()
    .test(
      'is-less-than-stockRequest',
      'Stock Process must be less than or equal to Stock Request',
      function (value) {
        return (value ?? 0) <= this.parent.stockRequest;
      },
    ),
  productId: yup.number(),
  sourceBranchId: yup.number(),
  destinationBranchId: yup.number(),
  note: yup.string(),
});
