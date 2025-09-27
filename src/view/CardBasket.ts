import { IEvents } from '../components/base/Events';
import { Product } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
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

export function renderCardBasketList(items: Product[], events: IEvents) {
  const itemsToRender = items.map((item) => {
    const card = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => {
        events.emit('basket:remove', item);
      },
    });
    return card.render({ price: item.price, title: item.title, index: items.indexOf(item) + 1 });
  });
  return itemsToRender;
}
