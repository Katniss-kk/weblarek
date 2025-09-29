import { IProduct } from "../../types";

export class basketItems {
  private selectedItems: IProduct[] = [];

  getAllSelectedItems(): IProduct[] {
    return [...this.selectedItems];
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItems.push(item);
  }

  deleteSelectedItemId(id: string): void {
    this.selectedItems = this.selectedItems.filter(item => item.id !== id);
  }
  
  clearBasket(): void {
    this.selectedItems = []
  }

  getTotalAmount(): number {
    return this.selectedItems.reduce((total, item) => 
        total + (item.price ?? 0), 0
    );
  }

  getTotalItems(): number {
    return this.selectedItems.length
  }

  searchItem(id: string): IProduct | undefined {
    return this.selectedItems.find(item => item.id === id);
  }
}