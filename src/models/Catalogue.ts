import { IEvents } from '../components/base/Events';
import { Product } from '../types';

export class Catalogue {
  private itemList: Product[];
  private selectedItem: Product | null;

  constructor(
    protected events: IEvents,
    products: Product[] = [],
    item: Product | null = null
  ) {
    this.itemList = products;

    if (item) {
      this.selectedItem = {
        id: item.id,
        description: item.description,
        image: item.image,
        title: item.title,
        category: item.category,
        price: item.price,
      };
    } else this.selectedItem = item;
  }

  getSelectedItem(): Product | null {
    return this.selectedItem;
  }

  setSelectedItem(item: Product | null): void {
    this.selectedItem = item;

    this.events.emit('selectedItem:change');
  }

  getItemById(id: string): Product | undefined {
    const query = this.itemList.find((item) => item.id === id);
    return query;
  }

  setItemList(itemList: Product[]): void {
    this.itemList = itemList;

    this.events.emit('catalogue:change');
  }

  getItemList(): Product[] {
    return this.itemList;
  }
}
