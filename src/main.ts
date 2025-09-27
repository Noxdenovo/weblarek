import './scss/styles.scss';
import { Catalogue } from './models/Catalogue';
import { Basket } from './models/Basket';
import { Customer } from './models/Customer';

import { Api } from './components/base/Api';
import { ProductApi } from './communication/ProductApi';
import { API_URL } from './utils/constants';
import { Header } from './view/Header';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './view/Gallery';
import { CardGallery } from './view/CardGallery';
import { Modal } from './view/Modal';
import { CardPreview } from './view/CardPreview';
import { BasketView } from './view/BasketView';
import { iCustomer, Product } from './types';
import { renderCardBasketList } from './view/CardBasket';
import { OrderForm } from './view/OrderForm';
import { ContactForm } from './view/ContactForm';
import { SuccessView } from './view/SuccessView';

const events = new EventEmitter();
const catalogue = new Catalogue(events);
const basket = new Basket(events);
const api = new Api(API_URL);
const customer = new Customer(events);
const productApi = new ProductApi(api);
const header = new Header(ensureElement<HTMLElement>('.header'), events);
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

const modal = new Modal(ensureElement('.modal'));
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate('#order'), events, {
  onClick: () => {
    events.emit('orderForm:submit');
  },
});
const contactForm = new ContactForm(cloneTemplate('#contacts'), events, {
  onClick: () => {
    events.emit('contactForm:submit');
  },
});

const successView = new SuccessView(cloneTemplate('#success'), {
  onClick: () => {
    modal.closeModal();
  },
});

productApi
  .get()
  .then((response) => {
    catalogue.setItemList(response);
  })

  .catch((err) => console.log(err));

header.render({ counter: basket.getItemNumber() });

events.on('catalogue:change', () => {
  const items = catalogue.getItemList();

  const itemsToRender = items.map((item) => {
    const card = new CardGallery(cloneTemplate('#card-catalog'), {
      onClick: () => {
        events.emit('card:select', item);
      },
    });
    return card.render(item);
  });
  gallery.galleryList = itemsToRender;
});

events.on<Product>('card:select', (item) => {
  catalogue.setSelectedItem(item);
});

events.on('card:deselect', () => {
  catalogue.setSelectedItem(null);
});

events.on('selectedItem:change', () => {
  const item = catalogue.getSelectedItem();
  if (item) {
    let preview;
    if (basket.isItemInBasket(item.id)) {
      preview = new CardPreview(cloneTemplate('#card-preview'), {
        onClick: () => {
          events.emit('basket:remove', item);
          events.emit('card:deselect');
          modal.closeModal();
        },
      });
      preview.buttonText = 'Удалить из корзины';
    } else {
      preview = new CardPreview(cloneTemplate('#card-preview'), {
        onClick: () => {
          events.emit('basket:add', item);
          events.emit('card:deselect');
          modal.closeModal();
        },
      });
      preview.buttonText = 'В корзину';
    }

    modal.content = preview.render(item);
    modal.openModal();
    console.log(item);
  } else {
    modal.closeModal();
  }
});

events.on('basket:open', () => {
  const items = basket.getItemList();
  if (items.length === 0) {
    basketView.setEmptyBasket();
    modal.content = basketView.render();
  } else {
    const itemsToRender = renderCardBasketList(items, events);
    basketView.toggleButtonOn();
    modal.content = basketView.render({ itemList: itemsToRender, total: basket.getTotal() });
  }
  modal.openModal();
});

events.on<Product>('basket:add', (item) => {
  basket.addItem(item);
});

events.on<Product>('basket:remove', (item) => {
  basket.removeItem(item);
});

events.on('basket:change', () => {
  const items = basket.getItemList();
  if (items.length === 0) {
    basketView.setEmptyBasket();
    modal.content = basketView.render();
  } else {
    const itemsToRender = renderCardBasketList(items, events);
    modal.content = basketView.render({ itemList: itemsToRender, total: basket.getTotal() });
  }
  header.render({ counter: basket.getItemNumber() });
});

events.on('basket:submit', () => {
  modal.render({ content: orderForm.render() });
});

events.on<iCustomer>('orderForm:change', (data) => {
  customer.setData(data);
  const newData = customer.getData();
  const errors = customer.validateData();
  if (errors.payment && errors.address) {
    orderForm.render({ error: 'Введите адрес и выберите способ оплаты' });
    orderForm.toggleSubmitOff();
  } else if (errors.payment) {
    orderForm.render({ error: errors.payment, address: newData.address, payment: newData.payment });
    orderForm.toggleSubmitOff();
  } else if (errors.address) {
    orderForm.render({ error: errors.address, address: newData.address, payment: newData.payment });
    orderForm.toggleSubmitOff();
  } else {
    orderForm.render({ error: '', address: newData.address, payment: newData.payment });
    orderForm.toggleSubmitOn();
  }
});

events.on('orderForm:submit', () => {
  modal.render({ content: contactForm.render() });
});

events.on('contactForm:change', (data) => {
  customer.setData(data);
  const newData = customer.getData();
  const errors = customer.validateData();
  if (errors.email && errors.phone) {
    contactForm.render({ error: 'Введите номер телефона и email' });
    contactForm.toggleSubmitOff();
  } else if (errors.phone) {
    contactForm.render({ error: errors.phone, phone: newData.phone, email: newData.email });
    contactForm.toggleSubmitOff();
  } else if (errors.email) {
    contactForm.render({ error: errors.email, phone: newData.phone, email: newData.email });
    contactForm.toggleSubmitOff();
  } else {
    contactForm.render({ error: '', phone: newData.phone, email: newData.email });
    contactForm.toggleSubmitOn();
  }
});

events.on('contactForm:submit', () => {
  const items = basket.getItemList().map((item) => item.id);
  console.log(items);
  productApi
    .post({ ...customer.getData(), total: basket.getTotal(), items: items })
    .then((result) => {
      basket.clearBasket();
      customer.clearData();
      modal.content = successView.render({ total: result.total });
    });
});
