export interface Product {
  name: string;
  description: string;
  image: string;
  price: number;
  ratings: number[]
}

export interface Comment {
  user: string;
  date: string;
  text: string;
}
