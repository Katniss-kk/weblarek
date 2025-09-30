import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<HTMLElement> {
    private basketList: HTMLElement;
    private button: HTMLButtonElement;
    private price: HTMLElement;

    constructor(private events: IEvents) {
        super(cloneTemplate<HTMLElement>('#basket'));
        
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.price = ensureElement<HTMLElement>('.basket__price', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('buy:click');
        });
    }

    render(items: HTMLElement[]): HTMLElement {
        this.basketList.innerHTML = '';
        
        if (items.length === 0) {
            this.basketList.textContent = 'Корзина пуста';
            this.button.disabled = true;
        } else {
            items.forEach(item => {
                this.basketList.appendChild(item);
            });
            this.button.disabled = false;
        }
        
        return this.container;
    }

    setAmountCount(count: number) {
        this.price.textContent = `${count} синапсов`;
    }
}