export class getApiService {
  constructor(private api: IApi) {}
  
  async getProducts(): Promise<productsApi> {
  return this.api.get<productsApi>('/product/');
  }
  async createOrder(orderData: Order): Promise<OrderResponse> {
    return this.api.post<OrderResponse>('/order/', orderData, 'POST');
  }
}