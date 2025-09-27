import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';
import { createElement, ensureElement } from '../utils/utils';

interface iBasketInput {
  itemList: HTMLElement[];
  total: number;
}

export class BasketView extends Component<iBasketInput> {
  protected itemListElement: HTMLElement;

  protected basketButton: HTMLButtonElement;

  protected totalElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);
    this.itemListElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton.addEventListener('click', () => this.events.emit('basket:submit'));
  }

  toggleButtonOn() {
    this.basketButton.disabled = false;
  }

  toggleButtonOff() {
    this.basketButton.disabled = true;
  }
  set itemList(itemList: HTMLElement[]) {
    this.itemListElement.replaceChildren(...itemList);
  }

  set total(value: number) {
    this.totalElement.textContent = String(value) + ' синапсов';
  }

  setEmptyBasket(): void {
    const emptyMessage = createElement('p');
    emptyMessage.textContent = 'Корзина пуста';
    emptyMessage.classList.add('basket__message');
    this.itemListElement.replaceChildren(emptyMessage);
    this.toggleButtonOff();
  }
}
