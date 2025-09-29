import { IProduct } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { CDN_URL } from "../../utils/constants";

export class SelectProductView {
  private template: HTMLElement
  private category: HTMLElement;
  private title: HTMLElement;
  private price: HTMLElement
  private image: HTMLImageElement;
  private text: HTMLElement;
  private button: HTMLButtonElement;
  private currentProduct: IProduct | null = null;
  private id: string;

  constructor(private events: IEvents) {
    this.template = cloneTemplate<HTMLElement>('#card-preview');

    this.category = ensureElement<HTMLElement>('.card__category', this.template);
    this.title = ensureElement<HTMLElement>('.card__title', this.template);
    this.price = ensureElement<HTMLElement>('.card__price', this.template);
    this.image = ensureElement<HTMLImageElement>('.card__image', this.template);
    this.text = ensureElement<HTMLElement>('.card__text', this.template);
    this.button = ensureElement<HTMLButtonElement>('.card__button', this.template)

    this.id = ''

    this.button.addEventListener('click', () => {
      if (this.currentProduct) {
        this.events.emit('addbasket:click', this.currentProduct);
      }
    });
  }

  setTemplate(product: IProduct): HTMLElement {
    const newClassName = categoryMap[product.category as keyof typeof categoryMap];
    this.category.classList.remove('card__category_soft');
    this.category.classList.add(newClassName);

    this.category.textContent = product.category;
    this.image.src = `${CDN_URL}/${product.image}`;
    this.image.alt = product.title;

    this.currentProduct = product;
    this.id = product.id;

    this.title.textContent = product.title;
    this.text.textContent = product.description;

    if(typeof product.price === 'number') {
      this.price.textContent = `${product.price} синапсов`;
      this.button.textContent = 'Добавить в корзину';
      this.button.disabled = false;
    } else {
      this.price.textContent = 'Бесценно';
      this.button.disabled = true;
    }

    return this.template;
  }

  setButton() {
  if (this.button.textContent === 'Добавить в корзину') {
    this.button.textContent = 'Удалить из корзины';
  } else if (this.button.textContent === 'Удалить из корзины') {
    this.button.textContent = 'Добавить в корзину';
  } else if (this.price.textContent === 'Бесценно'){
    this.button.textContent = 'Недоступно'
  } else {return}
}
}