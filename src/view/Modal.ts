import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';

export type TModal = { content: HTMLElement };

const page = ensureElement<HTMLElement>('.page');

export class Modal extends Component<TModal> {
  protected contentElement: HTMLElement;

  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.closeModal());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.container.classList.add('modal_active');
    page.classList.add('no-scroll');
  }
  closeModal() {
    this.container.classList.remove('modal_active');
    page.classList.remove('no-scroll');
  }

  set content(item: HTMLElement) {
    this.contentElement.replaceChildren(item);
  }
}
