export interface JournalForm {
  quantity: number;
  transactionType: string;
  description: string;
  branchId: string;
  productBranchId: string;
  mutationId: string;
}

export interface StockRequestForm {
  stockRequest: number;
  stockProcess: number;
  note: string;
  productId: string;
  status: string;
}
