import { Card } from './Card';
import { Product } from '../../types';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import { CategoryKey } from './CardGallery';
import { CDN_URL } from '../../utils/constants';
import { ICardActions } from './CardGallery';

export class CardPreview extends Card<Product> {
  protected imageElement: HTMLImageElement;

  protected categoryElement: HTMLElement;

  protected descriptionElement: HTMLElement;

  protected cardButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);
    if (actions?.onClick) {
      this.cardButtonElement.addEventListener('click', () => actions.onClick());
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(text: string) {
    this.cardButtonElement.textContent = text;
  }

  setButtonOff() {
    this.cardButtonElement.disabled = true;
  }
}
