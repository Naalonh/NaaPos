export type Option = {
  id?: string | number | null;
  name: string;
  price: number | "";
  image: string;
  description: string;
  status: boolean;
};

export type OptionGroup = {
  id?: string | number | null;
  groupName: string;
  required: boolean;
  status: "ACTIVE" | "DISABLED";
  options: Option[];
};

export type ProductForm = {
  id?: string | number | null; // optional
  name: string;
  category: string;
  currency: "USD" | "KHR";
  price: number | "";
  description: string;
  status: "active" | "disabled";
  image: string | null;
  imageFile: File | null;
  optionGroups: OptionGroup[];
};
