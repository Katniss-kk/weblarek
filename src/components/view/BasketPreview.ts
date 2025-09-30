import { IProduct } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class BasketPreview {
  constructor(private events: IEvents) {
  }

  setTemplate(product: IProduct, index: number): HTMLElement {
    const card = cloneTemplate<HTMLElement>('#card-basket');

    const indexElement = ensureElement<HTMLElement>('.basket__item-index', card);
    const title = ensureElement<HTMLElement>('.card__title', card);
    const price = ensureElement<HTMLElement>('.card__price', card);
    const button = ensureElement<HTMLButtonElement>('.basket__item-delete', card);

    indexElement.textContent = String(index + 1);
    title.textContent = product.title;
    price.textContent = product.price !== 0 ? `${product.price} синапсов` : 'бесценно';

    button.addEventListener('click', () => {
      this.events.emit('basket:delete', product.id);
    });

    return card;
  }
}