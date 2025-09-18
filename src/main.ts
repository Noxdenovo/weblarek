import './scss/styles.scss';
import { Catalogue } from './models/Catalogue';
import { Basket } from './models/Basket';
import { Customer } from './models/Customer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ProductApi } from './communication/ProductApi';
import { API_URL } from './utils/constants';

const catalogue = new Catalogue();

catalogue.setItemList(apiProducts.items);

console.log('массив из каталога главной страницы:', catalogue.getItemList());

catalogue.setSelectedItem(apiProducts.items[1]);

console.log('Выбранный продукт:', catalogue.getSelectedItem());

console.log('Поиск продукта по id', catalogue.getItemById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
console.log(
  'поиск продукта по id, которого нет в списке',
  catalogue.getItemById('101ab44-ed99-4a54-990d-47aa2bb4e7d9')
);

//тестирование методов класса Basket

const basket = new Basket();

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);
console.log('попытка добавить товар повторно:');
basket.addItem(apiProducts.items[0]);

console.log('Список товаров в корзине после добавления двух товаров:', basket.getItemList());

console.log('количество товаров в корзине: ', basket.getItemNumber());

console.log('Сумма товаров в корзине', basket.getTotal());

basket.removeItem(apiProducts.items[0]);

console.log('Товары в корзине после удаления одного товара:', basket.getItemList());

console.log(
  'Наличие товара в корзине, когда он там уже есть:',
  basket.isItemInBasket(apiProducts.items[1].id)
);

console.log(
  'Наличие товара в корзине, когда его там нет:',
  basket.isItemInBasket(apiProducts.items[0].id)
);

basket.clearBasket();

console.log('Корзина после очистки', basket.getItemList());

//тестирование методов класса Customer

const customer = new Customer();

customer.setData({
  payment: 'card',
  address: 'nowhere',
  email: 'nomail@mail.ru',
  phone: '+111111111',
});

console.log('данные покупателя после метода setData:', customer.getData());

customer.setData({ payment: 'cash', address: 'somewhere' });

console.log('данные покупателя после замены методом getData', customer.getData());

customer.clearData();

console.log('Данные покупателя после очистки', customer.getData());

console.log('Объект валидации данных', customer.validateData());

// тестирование методов класса ProductApi

const api = new Api(API_URL);
const productApi = new ProductApi(api);
productApi
  .get()
  .then((response) => {
    catalogue.setItemList(response);
    console.log('Массив, полученный с сервера: ', catalogue.getItemList());
  })
  .catch((err) => console.log(err));
