import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { getApiService } from './components/models/getApiService';
import { mainCatalog } from './components/models/mainCatalog';
import { basketItems } from './components/models/basketItem';
import { Purchase } from './components/models/purschase';
import { EventEmitter } from './components/base/Events';
import { HeaderView } from './components/view/HeaderView';
import { GaleryView } from './components/view/GaleryView';
import { Modal } from './components/view/Modal';
import { BasketPreview } from './components/view/BasketPreview';
import { BasketView } from './components/view/BasketView';
import { SelectProductView } from './components/view/SelectProductView';
import { OrderView } from './components/view/OrderView';
import { ContactsView } from './components/view/ContactsView';
import { Success } from './components/view/Success';

import { ensureElement } from './utils/utils';
import { IProduct, Order } from './types';


// Инициализация данных
const api = new Api(API_URL);
const apiService = new getApiService(api);
const products = await apiService.getProducts();


// Требуемые контейнеры
const containerHeader = ensureElement<HTMLElement>('.header__container');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Modal
const catalogModel = new mainCatalog();
const basketItemsModel = new basketItems();
const purchaseModel = new Purchase();
const events = new EventEmitter();

// View
const headerView = new HeaderView(events, containerHeader);
const galeryView = new GaleryView(events);
const modal = new Modal(events, modalContainer);
const basketPreviewView = new BasketPreview(events);
const basketView = new BasketView(events);
const selectProductView = new SelectProductView(events);
const orderView = new OrderView(events);
const contactsView = new ContactsView(events);
const success = new Success(events);

// Galery
catalogModel.saveAllProducts(products.items);
const content = catalogModel.getProducts();
galeryView.setTemplate(content);

// Открытие карточки товара
    events.on('card:click', (product: IProduct) => {
        console.log('Клик по карточке товаров')
        const isInBasket = basketItemsModel.searchItem(product.id)
        if(isInBasket !== undefined) {
            modal.open(selectProductView.setTemplate(product))
            selectProductView.setButton();
        } else {
            modal.open(selectProductView.setTemplate(product))
        }
        
    })

// Добавление карточки в корзину
events.on('addbasket:click', (product: IProduct) => {
    const isInBasket = basketItemsModel.searchItem(product.id);
    if (isInBasket === undefined) {
        basketItemsModel.saveSelectedItem(product);
        selectProductView.setButton();
        console.log(`добавили`, basketItemsModel.getAllSelectedItems());
    } else {
        basketItemsModel.deleteSelectedItemId(isInBasket.id);
        selectProductView.setButton();
        console.log(`удалили`,basketItemsModel.getAllSelectedItems());
    }
    headerView.setCounter(basketItemsModel.getTotalItems());
})


// Открытие корзины
events.on('basket:open', () => {
    console.log('Клик по корзине');
    const items = basketPreviewView.setTemplate(basketItemsModel.getAllSelectedItems());
    const basketElement = basketView.render(items);
    basketView.setAmountCount(basketItemsModel.getTotalAmount())
    modal.open(basketElement);
})

// Удаление из корзины
events.on('basket:delete', (id: string) => {
    console.log(`удалили`, id);
    basketItemsModel.deleteSelectedItemId(id);
    const updatedItems = basketPreviewView.setTemplate(basketItemsModel.getAllSelectedItems());
    basketView.render(updatedItems);
    basketView.setAmountCount(basketItemsModel.getTotalAmount())
    events.emit('basket:updated');
})

// Форма покупки
events.on('buy:click', () => {
    console.log('открываем форму покупки');
    purchaseModel.clearePurchase();
    modal.open(orderView.setTemplate());
})

events.on('buttonCash:click', () => {
    console.log('выбрана оплата наличными');
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
    if (errors.length === 0) {
        orderView.enableButton()
    } else {
        orderView.disableButton()
        console.log(errors)
    }
})

events.on('buttonCard:click', () => {
    console.log('выбрана оплата картой');
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
    if (errors.length === 0) {
        orderView.enableButton()
    } else {
        orderView.disableButton()
        console.log(errors)
    }
})

events.on('addressinput:text', () => {
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
    if (errors.length === 0) {
        orderView.enableButton();
    } else {
        console.log(errors);
        orderView.disableButton();
    }
})

events.on('buttonNext:click', () => {
    console.log('переходим к контактам');
    console.log(purchaseModel.getPurchase());
    modal.open(contactsView.setTemplate());
})

events.on('emailInput:text', () => {
    const formData = contactsView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateContacts();
    if (errors.length === 0) {
        contactsView.setButton(true)
    } else {
        contactsView.setButton(false)
        console.log(errors)
    }
})

events.on('phoneInput:text', () => {
    const formData = contactsView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateContacts();
    if (errors.length === 0) {
        contactsView.setButton(true)
    } else {
        contactsView.setButton(false)
        console.log(errors)
    }
})

// Отправка формы контактов
events.on('buttonPay:click', () => {
    console.log('нажата кнопка оплатить');
    console.log('Данные для заказа:', purchaseModel.getPurchase()); 

    const buyerData = purchaseModel.getPurchase();
    const basketItems = basketItemsModel.getAllSelectedItems();
    const totalAmount = basketItemsModel.getTotalAmount();

    contactsView.resetForm();

    const orderData: Order = {
        ...buyerData,
        items: basketItems.map(item => item.id),
        total: totalAmount
    };

        try {
        apiService.createOrder(orderData);
        
        success.setAmountPrice(totalAmount);  
        modal.open(success.setTemplate());
        console.log('Данные для заказа:', orderData);
    } catch (error) {
         console.error(error);
     }

    basketItemsModel.getAllSelectedItems();
    purchaseModel.clearePurchase();
    headerView.setCounter(0);
})

events.on('succesButton:close', () => {
    console.log('Модал закрыт');
    modal.close();
    
    basketItemsModel.clearBasket();
    purchaseModel.clearePurchase();
    
    headerView.setCounter(0);
    
    galeryView.setTemplate(content);
    
    console.log('Все данные удалены');
})























// const catalog = new mainCatalog();
// catalog.saveAllProducts(products.items);

// const containerHeader = document.querySelector('.header__container')
// const events = new EventEmitter()
// const header = new HeaderView(events, containerHeader)
// header.counter = 5

// // Galery
// const galery = new GaleryView(events)
// const content = catalog.getProducts()

// // SelectProduct
// const selectProduct = new SelectProductView(events);
// // events.on('inbasket:click', () => {
// //     console.log('клик в корзину');
    
    
// //     events.emit('modal:open');
// // });


// // Modal
// const modalContainer = ensureElement<HTMLElement>('#modal-container')
// const modal = new Modal(events, modalContainer)

// events.on('card:click', (product: IProduct) => {
//     console.log('Кликнули на товар:', product);
    
//     const modalContent = selectProduct.setTemplate(product);
//     console.log(selectProduct.setTemplate(product))
//     events.emit('modal:open', { content: modalContent });
// });

// // basket
// const basketPreview = new BasketPreview(events);
// const basketView = new BasketView(events);

// events.on('basket:open', () => {
//     console.log('Товары в каталоге:', content); // ✅ Проверяем данные
//     console.log('Количество товаров:', content.length); // ✅ Проверяем количество
    
//     const basketItems = basketPreview.setTemplate(content);
//     console.log('Создано элементов корзины:', basketItems.length); // ✅ Проверяем создание
    
//     basketView.setTemplate(basketItems);
//     events.emit('modal:open', {  });
// });

// // OrderView
// const orderView = new OrderView(events);

// // ContactsView
// const contactsView = new ContactsView(events)

// // Success
// const success = new Success(events)

// // удалить товар с корзины
// events.on('basket:delete', () => {
//     console.log(`Удалить товар нажата`)
// })

// // оформить покупку
// events.on('buy:click', () => {
//     console.log('Кнопка оформить нажата')
//     orderView.setTemplate();
// })

// orderView.setButton(true)

// events.on('buttonCash:click', () => {
//     console.log('нажата кнопка Cash')
// })

// events.on('buttonCard:click', () => {
//     console.log('Нажата кнопка Card')
// })

// events.on('addressinput:text', () => {
//     console.log(`введен адрес`)
// })

// events.on('buttonNext:click', () => {
//     console.log('Нажата кнопка далее')
//     contactsView.setTemplate()
// })

// events.on('emailInput:text', () => {
//     console.log('введен Email')
// })

// events.on('phoneInput:text', () => {
//     console.log('введен Phone')
// })

// events.on('buttonPay:click', () => {
//     console.log('Нажата кнопка оплатить')
//     success.setAmountPrice(123);
//     success.setTemplate();
// })

// events.on('succesButton:close', () => {
//     console.log('Кнопка закрытия модал окна')
//     modal.close()
// })

// galery.setTemplate(content)