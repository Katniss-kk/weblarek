import { cloneTemplate, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class ContactsView {
  private template: HTMLElement;
  private buttonPay: HTMLButtonElement;
  private inputEmail: HTMLInputElement;
  private inputPhone: HTMLInputElement;
  private events: IEvents;

  constructor(events: IEvents) {
    this.template = cloneTemplate<HTMLElement>('#contacts');
    this.buttonPay = ensureElement<HTMLButtonElement>('.button', this.template);
    this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.template);
    this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.template);
    this.events = events

    this.buttonPay.disabled = false

    this.inputEmail.addEventListener('input', () => {
      this.events.emit('emailInput:text');
    });
    this.inputPhone.addEventListener('input', () => {
      this.events.emit('phoneInput:text');
    });
    this.buttonPay.addEventListener('click', () => {
      this.events.emit('buttonPay:click');
    });
  }

  setTemplate() {
    this.buttonPay.type = 'button';
    return this.template;
  }

  setButton(result: Boolean) {
  if (result === true) {
    this.buttonPay.disabled = !result;
  } else if (result === false) {
    this.buttonPay.disabled = !result;
   }
  };

  getFormData(): { email: string; phone: string } {
    return {
        email: this.inputEmail.value.trim(),
        phone: this.inputPhone.value.trim()
    };
  }

    resetForm(): void {
    this.inputEmail.value = '';
    this.inputPhone.value = '';
    this.setButton(false);
  }
}