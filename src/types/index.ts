export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface Product {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface iCustomer {
  payment: 'cash' | 'card' | '';
  email: string;
  phone: string;
  address: string;
}

export type CustomerData = iCustomer & { total: number; items: string[] };

export interface OrderResponse {
  id: string;
  total: number;
}

export interface ProductResponse {
  total: number;
  items: Product[];
}
