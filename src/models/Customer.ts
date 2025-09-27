import { IEvents } from '../components/base/Events';
import { iCustomer } from '../types';

interface Errors {
  payment: string | undefined;
  address: string | undefined;
  email: string | undefined;
  phone: string | undefined;
}

export class Customer {
  private customerData: iCustomer;

  constructor(events: IEvents, data?: Partial<iCustomer>) {
    this.customerData = {
      payment: data?.payment ?? '',
      address: data?.address ?? '',
      email: data?.email ?? '',
      phone: data?.phone ?? '',
    };
  }

  setData(data: Partial<iCustomer>) {
    this.customerData = { ...this.customerData, ...data };
  }

  getData(): iCustomer {
    return this.customerData;
  }

  validateData(): Errors {
    const errors: Errors = {
      payment: undefined,
      address: undefined,
      email: undefined,
      phone: undefined,
    };

    if (!this.customerData.payment) {
      errors.payment = 'Выберите способ оплаты';
    }

    if (!this.customerData.address) {
      errors.address = 'Необходимо указать адрес';
    }

    if (!this.customerData.email) {
      errors.email = 'Необходимо указать email';
    }

    if (!this.customerData.phone) {
      errors.phone = 'Необходимо указать телефон';
    }

    return errors;
  }

  clearData(): void {
    this.customerData = {
      payment: '',
      address: '',
      email: '',
      phone: '',
    };
  }
}
