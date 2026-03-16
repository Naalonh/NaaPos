export type CategoryStatus = "active" | "disabled";

export type Category = {
  id: string;
  name: string;
  status: CategoryStatus;
  sortOrder?: number;
  createdAt?: string;
};
