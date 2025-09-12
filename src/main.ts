import './scss/styles.scss';
import { apiProducts } from "./utils/data";
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { getApiService } from './components/models/getApiService';
import { basketItems } from "./components/models/basketItem";
import { mainCatalog } from './components/models/mainCatalog';
import { Purchase } from './components/models/purschase';
import { TPayment, ApiPostMethods, IApi, IBuyer, IProduct, Order } from './types';

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
  console.log(productsPurchase.clearePurchase())
  productsPurchase.savePurchase({
    payment: '' as TPayment,
    email: '',
    phone: '78005553535',
    address: 'Moscow'
  })
  console.log(productsPurchase.validate())
    console.log(productsPurchase.clearePurchase())
  productsPurchase.savePurchase({
    payment: 'credit' as TPayment,
    email: 'asdasd@mail.ru',
    phone: '',
    address: ''
  })
  console.log(productsPurchase.validate())

  // api
const api = new Api(API_URL);
const apiService = new getApiService(api);

const products = await apiService.getProducts();
console.log(products);

productsMain.saveAllProducts(products.items)
console.log(productsMain.getProducts())