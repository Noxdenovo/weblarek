import { CustomerData, IApi, OrderResponse, Product, ProductResponse } from '../types';

export class ProductApi {
  Api: IApi;
  constructor(api: IApi) {
    this.Api = api;
  }

  get(): Promise<Product[]> {
    return this.Api.get<ProductResponse>('/product/').then((response) => response.items);
  }
  post(data: CustomerData): Promise<OrderResponse> {
    return this.Api.post<OrderResponse>('/order/', data, 'POST');
  }
}
