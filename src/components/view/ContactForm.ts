import { IEvents } from '../base/Events';
import { iCustomer } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Form, TFormActions } from './Form';

type TContactForm = Pick<iCustomer, 'email' | 'phone'> | { error: string };

export class ContactForm extends Form<TContactForm> {
  protected emailInput: HTMLInputElement;

  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    actions?: TFormActions
  ) {
    super(container, actions);

    this.emailInput = ensureElement<HTMLInputElement>('#email-input', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('#phone-input', this.container);

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contactForm:change', { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contactForm:change', { phone: this.phoneInput.value });
    });
  }
  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set email(value: string) {
    this.emailInput.value = value;
  }
}
