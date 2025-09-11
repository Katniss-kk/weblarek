export class getApiService {
  constructor(private api: IApi) {}
  async getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  async createOrder(orderData: Order): Promise<unknown> {
    return this.api.post('/order/', orderData, 'POST');
  }
}