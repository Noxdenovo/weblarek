import { Product } from '../types';
import { ensureElement } from '../utils/utils';
import { Card } from './Card';
import { categoryMap } from '../utils/constants';
import { CDN_URL } from '../utils/constants';
type TCardGallery = Pick<Product, 'image' | 'category' | 'title' | 'price'>;

export interface ICardActions {
  onClick: Function;
}

export type CategoryKey = keyof typeof categoryMap;

export class CardGallery extends Card<TCardGallery> {
  protected imageElement: HTMLImageElement;

  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    if (actions?.onClick) {
      this.container.addEventListener('click', () => actions.onClick());
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as CategoryKey], key === value);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent);
  }
}
