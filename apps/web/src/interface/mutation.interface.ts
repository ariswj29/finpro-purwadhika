export interface mutation {
  id: number;
  no: number;
  status: string;
  sourceBranch: {
    name: string;
  };
  destinationBranch: {
    name: string;
  };
  product: {
    name: string;
  };
  stockRequest: number;
  stockProcess: number;
}
