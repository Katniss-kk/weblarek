import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { TPayment } from "../../types";

export class OrderView {
  private template: HTMLElement;
  private buttonCash: HTMLButtonElement;
  private buttonCard: HTMLButtonElement;
  private inputAddress: HTMLInputElement;
  private buttonNext: HTMLButtonElement;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.template = cloneTemplate<HTMLElement>('#order');
    
    this.buttonCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.template);
    this.buttonCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.template);
    this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.template);
    this.buttonNext = ensureElement<HTMLButtonElement>('.order__button', this.template);

        this.buttonCash.addEventListener('click', () => {
      this.buttonCard.classList.remove('button_alt-active');
      this.buttonCash.classList.add('button_alt-active');
      this.events.emit('buttonCash:click');
    });

    this.buttonCard.addEventListener('click', () => {
      this.buttonCash.classList.remove('button_alt-active');
      this.buttonCard.classList.add('button_alt-active');
      this.events.emit('buttonCard:click');
    });

    this.buttonNext.addEventListener('click', (event: Event) => {
      event.preventDefault();
      this.events.emit('buttonNext:click');
    });

    this.inputAddress.addEventListener('input', () => {
      this.events.emit('addressinput:text');
    });
  }

  getFormData(): { payment: TPayment; address: string } {
    const payment: TPayment = this.buttonCash.classList.contains('button_alt-active') 
      ? 'cash' 
      : this.buttonCard.classList.contains('button_alt-active') 
        ? 'online' 
        : '' as TPayment;

        const address = this.inputAddress.value

    return {
      payment,
      address: address.trim()
    };
  }

  resetForm(): void {
    this.buttonCash.classList.remove('button_alt-active');
    this.buttonCard.classList.remove('button_alt-active');
    this.inputAddress.value = '';
    this.disableButton();
  }

  setTemplate(): HTMLElement {
    this.resetForm();
    return this.template;
  }

  enableButton() {
    this.buttonNext.disabled = false;
  }

  disableButton() {
    this.buttonNext.disabled = true;
  }

  
}