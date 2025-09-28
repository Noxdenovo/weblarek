import { IEvents } from '../base/Events';
import { iCustomer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form, TFormActions } from './Form';

export type TOrderForm = { error: string } | Pick<iCustomer, 'address' | 'payment'>;

export class OrderForm extends Form<TOrderForm> {
  protected cashMethod: HTMLButtonElement;
  protected cardMethod: HTMLButtonElement;
  protected addressField: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    actions?: TFormActions
  ) {
    super(container, actions);
    this.cashMethod = ensureElement<HTMLButtonElement>('#cash-button', this.container);
    this.cardMethod = ensureElement<HTMLButtonElement>('#card-button', this.container);
    this.addressField = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.cashMethod.addEventListener('click', () => {
      events.emit('orderForm:change', { payment: 'cash' });
    });

    this.cardMethod.addEventListener('click', () => {
      events.emit('orderForm:change', { payment: 'card' });
    });

    this.addressField.addEventListener('input', () =>
      this.events.emit('orderForm:change', { address: this.addressField.value })
    );
  }

  set payment(value: string) {
    if (value === 'cash') {
      this.cashMethod.classList.add('button_alt-active');
      this.cardMethod.classList.remove('button_alt-active');
    } else if (value === 'card') {
      this.cardMethod.classList.add('button_alt-active');
      this.cashMethod.classList.remove('button_alt-active');
    } else {
      this.cardMethod.classList.remove('button_alt-active');
      this.cashMethod.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressField.value = value;
  }
}
