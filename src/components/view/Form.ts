import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export type TFormActions = { onClick: Function };

export class Form<T> extends Component<T> {
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: TFormActions) {
    super(container);
    this.errorElement = ensureElement<HTMLElement>('.form__errors', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
    });
    if (actions?.onClick) {
      this.submitButton.addEventListener('click', () => {
        actions.onClick();
      });
    }
  }

  set error(value: string) {
    this.errorElement.textContent = value;
  }

  toggleSubmitOn(): void {
    this.submitButton.disabled = false;
  }

  toggleSubmitOff(): void {
    this.submitButton.disabled = true;
  }
}
