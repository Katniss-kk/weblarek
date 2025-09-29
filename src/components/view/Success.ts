import { cloneTemplate } from "../../utils/utils";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Success {
  private template: HTMLElement;
  private modal: HTMLElement;
  private amount: HTMLElement;
  private button: HTMLButtonElement
  private events: IEvents

  constructor(events: IEvents) {
    this.template = cloneTemplate<HTMLElement>('#success');
    this.modal = ensureElement<HTMLElement>('.modal__content');
    this.amount = ensureElement<HTMLElement>('.order-success__description', this.template);
    this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.template);
    this.events = events

    this.button.addEventListener('click', () => {
      this.events.emit('succesButton:close');
    });
  }

  setAmountPrice(amount: Number) {
    this.amount.textContent = `Списано ${amount} синапсов`
  }

  setTemplate() {
    return this.template;
  }
}