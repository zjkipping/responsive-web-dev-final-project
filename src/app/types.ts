export interface Product {
  name: string;
  description: string;
  image: string;
  price: number;
  ratings: Rating[];
  uid: string;
}

export interface CartItem {
  product: Product;
  count: number;
}

export interface Rating {
  value: number;
  userID: string;
}

export interface Comment {
  productID: string;
  userID: string;
  text: string;
  date: string;
}

export interface User {
  uid: string;
  email: string;
  level: PrivilegeLevel;
  photoURL?: string;
  displayName?: string;
}

export enum PrivilegeLevel {
  General,
  Admin
}
