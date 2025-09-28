import { Component } from '../base/Component';

type TCardList = { cards: HTMLElement };

export class Gallery extends Component<TCardList> {
  protected gallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.gallery = this.container;
  }

  set galleryList(cardList: HTMLElement[]) {
    this.gallery.replaceChildren(...cardList);
  }
}
