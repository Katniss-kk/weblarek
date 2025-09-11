export class mainCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  saveAllProducts(products: IProduct[]): void {
    this.products = products;
  }
  
  getProducts(): IProduct[] {
    return [...this.products];
  }
  
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
  
  saveProduct(thisProduct: IProduct): IProduct {
    this.selectedProduct = thisProduct;
    return thisProduct;
  }
  
  getSelectedProducts(): IProduct[] {
    return this.selectedProduct;
  }
}