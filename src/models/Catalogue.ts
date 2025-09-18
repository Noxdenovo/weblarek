import { Product } from '../types';

export class Catalogue {
  private itemList: Product[];
  private selectedItem: Product;

  constructor(products: Product[] = [], item?: Product) {
    this.itemList = products;
    this.selectedItem = {
      id: item?.id ?? '',
      description: item?.description ?? '',
      image: item?.image ?? '',
      title: item?.title ?? '',
      category: item?.category ?? '',
      price: item?.price ?? null,
    };
  }

  getSelectedItem(): Product {
    return this.selectedItem;
  }

  setSelectedItem(item: Product): void {
    this.selectedItem = item;
  }

  getItemById(id: string): Product | undefined {
    let query = this.itemList.find((item) => item.id === id);
    return query;
  }

  setItemList(itemList: Product[]): void {
    this.itemList = itemList;
  }

  getItemList(): Product[] {
    return this.itemList;
  }
}
