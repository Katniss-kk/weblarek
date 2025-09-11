import './scss/styles.scss';

export const apiProducts = {
    "total": 10,
    "items": [
        {
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        },
        {
            "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
            "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
            "image": "/Shell.svg",
            "title": "HEX-леденец",
            "category": "другое",
            "price": 1450
        },
        {
            "id": "b06cde61-912f-4663-9751-09956c0eed67",
            "description": "Будет стоять над душой и не давать прокрастинировать.",
            "image": "/Asterisk_2.svg",
            "title": "Мамка-таймер",
            "category": "софт-скил",
            "price": null
        },
        {
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        },
    ]
}

export class basketItems {
  private selectedItems: IProduct[] = [];

  getAllSelectedItems(): IProduct[] {
    return [...this.selectedItems];
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItems.push(item);
  }

  deleteSelectedItemId(id: string): void {
    this.selectedItems = this.selectedItems.filter(item => item.id !== id);
  }
  
  clearBasket(): void {
    this.selectedItems = []
  }

  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => 
        total + (item.price ?? 0), 0
    );
  }

  getTotalItems(): number {
    return this.selectedItems.length
  }

  searchItem(id: string): IProduct | undefined {
    return this.selectedItems.find(item => item.id === id);
  }
}

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

export class Purchase {
  private purchaseData: IBuyer = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };

  savePurchase(data: IBuyer): void {
    if (data.payment) {
      this.purchaseData.payment = data.payment
    } if (data.email) {
      this.purchaseData.email = data.email
    } if (data.phone) {
      this.purchaseData.phone = data.phone
    } if (data.address) {
      this.purchaseData.address = data.address
    }
  }

  getPurchase(): IBuyer {
    return {...this.purchaseData};
  }

  clearePurchase(): void {
    this.purchaseData = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };
  };
  
  validate(data: IBuyer): string[] {
    const errors: string[] = [];
    
    if (!data.payment || !['online', 'credit'].includes(data.payment)) {
        errors.push('Выберите способ оплаты');
    }
    if (!data.email || !data.email.includes('@')) {
        errors.push('Некорректный Email');
    }
    if (!data.phone || data.phone.length < 9) {
        errors.push('Некорректный номер телефона');
    }
    if (!data.address || data.address.length < 5) {
        errors.push('Некорректный адрес');
    }
    
    if (errors.length === 0) {
        Object.assign(this.purchaseData, data);
    }
    
    return errors;
  }
}

export class getApiService {
  constructor(private api: IApi) {}
  async getProducts(): Promise<IProduct[]> {
    return this.api.get<IProduct[]>('/product/');
  }

  async createOrder(orderData: Order): Promise<unknown> {
    return this.api.post('/order/', orderData, 'POST');
  }
}

// basketItem
console.log("Basket")
const productsModel = new basketItems();
productsModel.saveSelectedItem(apiProducts.items[2]);
console.log(productsModel.getAllSelectedItems())
productsModel.saveSelectedItem(apiProducts.items[3]);
productsModel.saveSelectedItem(apiProducts.items[0]);
console.log(productsModel.getAllSelectedItems())
console.log(productsModel.getTotalItems())
console.log(productsModel.getTotalAmount())
console.log(productsModel.clearBasket())

// mainCatalog
console.log("mainCatalog")
const productsMain = new mainCatalog();
productsMain.saveAllProducts(apiProducts.items);
console.log(productsMain.getProducts())
console.log(productsMain.getProductById("b06cde61-912f-4663-9751-09956c0eed67"))
console.log(productsMain.saveProduct(apiProducts.items[3]))
console.log(productsMain.getSelectedProducts())

// purchase
console.log("purchase")
const productsPurchase = new Purchase();
productsPurchase.savePurchase({
    payment: 'Online' as TPayment,
    email: '123123asd@mail.ru',
    phone: '78005553535',
    address: 'Moscow'
  })
  console.log(productsPurchase.getPurchase())
  console.log(productsPurchase.clearePurchase)