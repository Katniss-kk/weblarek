export class basketItem {
  private selectedItem: IProduct[] = [];

  getAllSelectedItems(): IProduct[] {
    return [...this.selectedItem];
  }

  saveSelectedItem(item: IProduct): void {
    this.selectedItem.push(item);
  }

  deleteSelectedItemId(id: string): void {
    this.selectedItem = this.selectedItem.filter(item => item.id !== id);
  }
  
  clearBasket(): void {
    this.selectedItem = []
  }

  getAmountCount(): number {
    let amount = 0;
    for (const item of this.selectedItem) {
      if (item.price !== null) {
        amount += item.price;
      }
    }
    return amount;
  }

  getAmountItems(): number {
    return this.selectedItem.length
  }

  searchItem(id: string): IProduct | undefined {
    return this.selectedItem.find(item => item.id === id);
  }
}