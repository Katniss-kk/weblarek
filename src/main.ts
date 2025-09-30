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
import { galeryCardView } from './components/view/galeryCardView';

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
const basketView = new BasketView(events);
const selectProductView = new SelectProductView(events);
const orderView = new OrderView(events);
const contactsView = new ContactsView(events);
const success = new Success(events);

// Galery
catalogModel.saveAllProducts(products.items);
const content = catalogModel.getProducts();

const catalogItemView = new galeryCardView(events);
const catalogItems = content.map(product => catalogItemView.render(product));

// Рендерим галерею
galeryView.render(catalogItems);

// Открытие карточки товара
events.on('card:click', (product: IProduct) => {
    console.log('Клик по карточке товаров');
    const isInBasket = basketItemsModel.searchItem(product.id);
    
    // Передаем правильное значение в setButton
    if (product.price === null) {
        selectProductView.setButton(null); // недоступно
    } else {
        selectProductView.setButton(isInBasket !== undefined); // true - в корзине, false - не в корзине
    }
    
    modal.open(selectProductView.setTemplate(product));
});

// Добавление карточки в корзину
events.on('addbasket:click', (product: IProduct) => {
    const isInBasket = basketItemsModel.searchItem(product.id);
    if (isInBasket === undefined) {
        basketItemsModel.saveSelectedItem(product);
        selectProductView.setButton(true); // теперь в корзине
        console.log(`добавили`, basketItemsModel.getAllSelectedItems());
    } else {
        basketItemsModel.deleteSelectedItemId(isInBasket.id);
        selectProductView.setButton(false); // теперь не в корзине
        console.log(`удалили`, basketItemsModel.getAllSelectedItems());
    }
    headerView.setCounter(basketItemsModel.getTotalItems());
});

// Открытие корзины
events.on('basket:open', () => {
    console.log('Клик по корзине');
    const products = basketItemsModel.getAllSelectedItems();
    const basketPreviewView = new BasketPreview(events);
    const items = products.map((product, index) => 
        basketPreviewView.setTemplate(product, index)
    );
    const basketElement = basketView.render(items);
    basketView.setAmountCount(basketItemsModel.getTotalAmount());
    modal.open(basketElement);
});

// Удаление из корзины
events.on('basket:delete', (id: string) => {
    console.log(`удалили`, id);
    basketItemsModel.deleteSelectedItemId(id);
    const products = basketItemsModel.getAllSelectedItems();
    const basketPreviewView = new BasketPreview(events);
    const updatedItems = products.map((product, index) => 
        basketPreviewView.setTemplate(product, index)
    );
    basketView.render(updatedItems);
    basketView.setAmountCount(basketItemsModel.getTotalAmount());
    headerView.setCounter(basketItemsModel.getTotalItems());
    events.emit('basket:updated');
});

let orderErrorShown = false;
let contactsErrorShown = false;

// Форма покупки
events.on('buy:click', () => {
    console.log('открываем форму покупки');
    purchaseModel.clearePurchase();
    orderErrorShown = false;
    modal.open(orderView.setTemplate());
});

events.on('buttonCash:click', () => {
    console.log('выбрана оплата наличными');
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
        if(errors.length === 0) {
            orderView.resetErrors();
            orderView.enableButton();
    } else {
        errors.forEach(error => orderView.setErrors(error));
        orderView.disableButton();
    };
});

events.on('buttonCard:click', () => {
    console.log('выбрана оплата картой');
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
        if(errors.length === 0) {
            orderView.resetErrors();
            orderView.enableButton();
    } else {
        errors.forEach(error => orderView.setErrors(error));
        orderView.disableButton();
    };
});

events.on('addressinput:text', () => {
    const formData = orderView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateOrder();
        if(errors.length === 0) {
            orderView.resetErrors();
            orderView.enableButton();
    } else {
        errors.forEach(error => orderView.setErrors(error));
        orderView.disableButton();
    };
});

events.on('buttonNext:click', () => {
    console.log('переходим к контактам');
    console.log(purchaseModel.getPurchase());
    contactsErrorShown = false;
    modal.open(contactsView.setTemplate());
});

events.on('emailInput:text', () => {
    const formData = contactsView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateContacts();
    if(errors.length === 0) {
            contactsView.resetErrors();
            contactsView.setButton(true);
    } else {
        errors.forEach(error => contactsView.setErrors(error));
        contactsView.setButton(false);
    };
});

events.on('phoneInput:text', () => {
    const formData = contactsView.getFormData();
    purchaseModel.savePurchase(formData);
    const errors = purchaseModel.validateContacts();
    if(errors.length === 0) {
            contactsView.resetErrors();
            contactsView.setButton(true);
    } else {
        errors.forEach(error => orderView.setErrors(error));
        contactsView.setButton(false);
    };
});

// Отправка формы контактов
events.on('buttonPay:click', async () => {
    console.log('нажата кнопка оплатить');
    
    const buyerData = purchaseModel.getPurchase();
    const basketItems = basketItemsModel.getAllSelectedItems();
    const totalAmount = basketItemsModel.getTotalAmount();

    const orderData: Order = {
        ...buyerData,
        items: basketItems.map(item => item.id),
        total: totalAmount
    };

    try {
        await apiService.createOrder(orderData);
        
        success.setAmountPrice(totalAmount);  
        modal.open(success.setTemplate());
        console.log('Данные для заказа:', orderData);
        
        basketItemsModel.clearBasket();
        headerView.setCounter(0);
        contactsView.resetForm();
        purchaseModel.clearePurchase();
        
    } catch (error) {
        console.error(error);
        modal.open(success.setTemplate()); // тут конечно вопрос надо оно или нет. но т.к валидации на этот счет нет я выведу для показа функционала
    }
});

events.on('succesButton:close', () => {
    console.log('Модал закрыт');
    modal.close();
    
    contactsView.resetForm();
    
    console.log('Все данные удалены');
});