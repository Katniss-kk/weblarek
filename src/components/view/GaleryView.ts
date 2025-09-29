import { IProduct } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";

export class GaleryView {
    private galery: HTMLElement;
    private template: HTMLElement;

    constructor(private events: IEvents) {
        this.galery = ensureElement<HTMLElement>('.gallery');
        this.template = cloneTemplate<HTMLElement>('#card-catalog');
    }

    setTemplate(data: IProduct[]) {
        this.galery.innerHTML = '';

        data.forEach(product => {
            const card = this.template.cloneNode(true) as HTMLElement;
            
            const category = ensureElement<HTMLElement>('.card__category', card);
            const title = ensureElement<HTMLElement>('.card__title', card);
            const price = ensureElement<HTMLElement>('.card__price', card);
            const image = ensureElement<HTMLImageElement>('.card__image', card);

            category.textContent = product.category;
            title.textContent = product.title;

            const newClassName = categoryMap[product.category as keyof typeof categoryMap];

            category.classList.remove('card__category_soft');
            category.classList.add(newClassName);
            
            if (product.price == null) {
                price.textContent = `Бесценно`;
            } else {
                price.textContent = `${product.price} синапсов`;
            }
            
            image.src = `${CDN_URL}/${product.image}`;
            image.alt = product.title;

            card.addEventListener('click', () => {
                this.events.emit('card:click', product);
            });

            this.galery.appendChild(card);
        });
    }
}