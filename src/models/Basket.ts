import { Product } from '../types';

export class Basket {
  private itemList: Product[];

  constructor(items: Product[] = []) {
    this.itemList = items;
  }

  isItemInBasket(productId: string): boolean {
    if (this.itemList.find((item) => item.id === productId)) {
      return true;
    } else return false;
  }

  addItem(item: Product): void {
    try {
      if (!this.isItemInBasket(item.id)) {
        this.itemList.push(item);
      } else throw new Error('item already in basket');
    } catch (err) {
      console.log(err);
    }
  }

  removeItem(item: Product): void {
    this.itemList = this.itemList.filter((product) => product.id != item.id);
  }

  getItemList(): Product[] {
    return this.itemList;
  }

  getTotal(): number {
    let total = 0;
    this.itemList.forEach((item) => {
      if (item.price) {
        total = total + item.price;
      }
    });
    return total;
  }

  getItemNumber(): number {
    return this.itemList.length;
  }

  clearBasket(): void {
    this.itemList = [];
  }
}
