import { ensureElement } from "../../utils/utils"
import { Component } from "../base/Component"
import { IEvents } from "../base/Events"

interface IModal {
  content: HTMLElement
}

export class Modal extends Component<IModal> {
  private closeButton: HTMLButtonElement
  private content: HTMLElement
  private events: IEvents;

  constructor(events: IEvents, container: HTMLElement) {
    super(container, events) 
    this.events = events;

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close')
    this.content = ensureElement<HTMLElement>('.modal__content')

    this.closeButton.addEventListener('click', () => {
      this.close()
    })
    
    this.events.on('modal:open', (data: { content: HTMLElement }) => {
        this.open(data.content);
    });

    this.events.on('modal:close', () => {
        this.close();
    });
  }

  open(content: HTMLElement) {
    this.content.innerHTML = '';
    this.content.appendChild(content);
    this.container.classList.add('modal_active');
    this.events.emit('modal:opened');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content.innerHTML = '';
    this.events.emit('modal:closed');
  }
}