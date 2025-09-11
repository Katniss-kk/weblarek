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

export class basketItem {
  private selectedItem: IProduct[] = [];

  getAllSelectedItems(): IProduct[] {
    return [...this.selectedItem];
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItem.push(item);
  }

  deleteSelectedItemId(id: string): void {
    this.selectedItem = this.selectedItem.filter(item => item.id !== id);
  }
  
  clearBasket(): void {
    this.selectedItem = []
  }

  getAmountCount(): number {
    let amount = 0;
    for (const item of this.selectedItem) {
      if (item.price !== null) {
        amount += item.price;
      }
    }
    return amount;
  }

  getAmountItems(): number {
    return this.selectedItem.length
  }

  searchItem(id: string): IProduct | undefined {
    return this.selectedItem.find(item => item.id === id);
  }
}

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

class Purchase {
  private purchaseData: IBuyer = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };

  savePurchase(data: IBuyer): void {
    this.purchaseData = {...data}
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
  validate(): boolean {
    if (!this.purchaseData.payment) {
      return false;
    }

    if (!this.purchaseData.address.trim() || this.purchaseData.address.trim().length < 5) {
      return false;
    }

    const phoneRegex = /^(\+7|8)[\d\-\(\)\s]{10,15}$/;
    if (!this.purchaseData.phone.trim() || !phoneRegex.test(this.purchaseData.phone.replace(/\s/g, ''))) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.purchaseData.email.trim() || !emailRegex.test(this.purchaseData.email)) {
      return false;
    }

    return true;
  }
}

// basketItem
console.log("Basket")
const productsModel = new basketItem();
productsModel.saveSelectedItem(apiProducts.items[2]);
console.log(productsModel.getAllSelectedItems())
productsModel.saveSelectedItem(apiProducts.items[3]);
productsModel.saveSelectedItem(apiProducts.items[0]);
console.log(productsModel.getAllSelectedItems())
console.log(productsModel.getAmountItems())
console.log(productsModel.getAmountCount())
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