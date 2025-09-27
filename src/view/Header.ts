import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/Events';
import { ensureElement } from '../utils/utils';

type THeaderCounter = { counter: number };

export class Header extends Component<THeaderCounter> {
  protected basketCounter: HTMLElement;

  protected basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);
    this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }
  set counter(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
