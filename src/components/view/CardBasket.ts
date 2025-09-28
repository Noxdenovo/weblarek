import { Product } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { ICardActions } from './CardGallery';

export type TCardBasket = Pick<Product, 'price' | 'title'> & { index: number };

export class CardBasket extends Card<TCardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (actions?.onClick) {
      this.deleteButton.addEventListener('click', () => actions.onClick());
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
