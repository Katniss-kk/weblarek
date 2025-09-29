import { IProduct } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketPreview{
  private template: HTMLElement;
  private items: HTMLElement[] = [];

  constructor(private events: IEvents) {
    this.template = cloneTemplate<HTMLElement>('#card-basket');
  }

  setTemplate(products: IProduct[]): HTMLElement[] {
    this.items = [];
    
    products.forEach((product, index) => {
      const card = this.template.cloneNode(true) as HTMLElement;

      const indexElement = ensureElement<HTMLElement>('.basket__item-index', card);
      const title = ensureElement<HTMLElement>('.card__title', card);
      const price = ensureElement<HTMLElement>('.card__price', card);
      const button = ensureElement<HTMLButtonElement>('.basket__item-delete', card);

      indexElement.textContent = String(index + 1);
      title.textContent = product.title;
      price.textContent = product.price !== 0 ? `${product.price} синапсов` : 'бесценно';

      const id = product.id

      button.addEventListener('click', () => {
        this.events.emit('basket:delete', product.id);
      });

      this.items.push(card);
    });

    return this.items;
  }
}