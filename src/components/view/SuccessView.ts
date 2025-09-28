import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { TFormActions } from './Form';

type TSuccessView = { total: number };

export class SuccessView extends Component<TSuccessView> {
  protected successDescription: HTMLElement;

  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: TFormActions) {
    super(container);

    this.successDescription = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    if (actions?.onClick) {
      this.closeButton.addEventListener('click', () => actions.onClick());
    }
  }
  set total(value: string) {
    this.successDescription.textContent = `Списано ${value} синапсов`;
  }
}
