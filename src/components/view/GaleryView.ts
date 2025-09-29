import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

export class GaleryView extends Component<HTMLElement> {
    constructor(private events: IEvents) {
        super(ensureElement<HTMLElement>('.gallery'));
    }

    render(items: HTMLElement[]): HTMLElement {
        this.container.innerHTML = '';
        items.forEach(item => {
            this.container.appendChild(item);
        });
        return this.container;
    }
}