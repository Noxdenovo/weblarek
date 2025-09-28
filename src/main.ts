import './scss/styles.scss';
import { Catalogue } from './models/Catalogue';
import { Basket } from './models/Basket';
import { Customer } from './models/Customer';

import { Api } from './components/base/Api';
import { ProductApi } from './communication/ProductApi';
import { API_URL } from './utils/constants';
import { Header } from './components/view/Header';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/view/Gallery';
import { CardGallery } from './components/view/CardGallery';
import { Modal } from './components/view/Modal';
import { CardPreview } from './components/view/CardPreview';
import { BasketView } from './components/view/BasketView';
import { iCustomer, Product } from './types';
import { CardBasket } from './components/view/CardBasket';
import { OrderForm } from './components/view/OrderForm';
import { ContactForm } from './components/view/ContactForm';
import { SuccessView } from './components/view/SuccessView';
import { IEvents } from './components/base/Events';

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

function renderCardBasketList(items: Product[], events: IEvents) {
  const itemsToRender = items.map((item) => {
    const card = new CardBasket(cloneTemplate('#card-basket'), {
      onClick: () => {
        events.emit('basket:remove', item);
      },
    });
    return card.render({ price: item.price, title: item.title, index: items.indexOf(item) + 1 });
  });
  return itemsToRender;
}

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

    if (item.price === null) {
      preview = new CardPreview(cloneTemplate('#card-preview'));
      preview.buttonText = 'Недоступно';
      preview.setButtonOff();
    } else if (basket.isItemInBasket(item.id)) {
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
  } else {
    modal.closeModal();
  }
});

events.on('basket:open', () => {
  const itemNumber = basket.getItemNumber();
  if (itemNumber === 0) {
    basketView.setEmptyBasket();
  }
  modal.content = basketView.render();
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
    basketView.toggleButtonOn();
    modal.content = basketView.render({ itemList: itemsToRender, total: basket.getTotal() });
  }
  header.render({ counter: basket.getItemNumber() });
});

events.on('basket:submit', () => {
  const formData = { payment: customer.getData().payment, address: customer.getData().address };
  modal.render({ content: orderForm.render(formData) });
});

events.on<iCustomer>('orderForm:change', (data) => {
  customer.setData(data);
  const errors = customer.validateData();
  const orderErrors = { payment: errors.payment, address: errors.address };

  const error = Object.values(orderErrors)
    .filter((value) => !!value)
    .join('; ');
  orderForm.render({ error: error });

  if (!orderErrors.payment && !orderErrors.address) {
    orderForm.toggleSubmitOn();
  } else {
    orderForm.toggleSubmitOff();
  }
});

events.on('orderForm:submit', () => {
  modal.render({ content: contactForm.render() });
});

events.on('contactForm:change', (data) => {
  customer.setData(data);
  const errors = customer.validateData();
  const contactErrors = { phone: errors.phone, email: errors.email };
  const error = Object.values(contactErrors)
    .filter((value) => !!value)
    .join('; ');
  contactForm.render({ error: error });

  if (!contactErrors.phone && !contactErrors.email) {
    contactForm.toggleSubmitOn();
  } else {
    contactForm.toggleSubmitOff();
  }
});

events.on('contactForm:submit', () => {
  const items = basket.getItemList().map((item) => item.id);
  productApi
    .post({ ...customer.getData(), total: basket.getTotal(), items: items })
    .then((result) => {
      basket.clearBasket();
      customer.clearData();
      modal.content = successView.render({ total: result.total });
    })
    .catch((err) => console.log(err));
});

events.on<iCustomer>('customerData:change', (data) => {
  orderForm.render({ payment: data.payment, address: data.address });
  contactForm.render({ phone: data.phone, email: data.email });
});
