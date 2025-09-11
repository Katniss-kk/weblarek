class mainCatalog {
  private products: IProduct[] = [];  // массив товаров
  private selectedProduct: IProduct[] = []; // массив выбранных товаров

  saveAllProducts(products: IProduct[]): void {
    this.products = [...products];
  }
  
  getProducts(): IProduct[] {
    return [...this.products];
  }
  
  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
  
  saveProduct(thisProduct: IProduct): IProduct {
    this.selectedProduct.push(thisProduct);
    return thisProduct;
  }
  
  getSelectedProducts(): IProduct[] {
    return [...this.selectedProduct];
  }
}