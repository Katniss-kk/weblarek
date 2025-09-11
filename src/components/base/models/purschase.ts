class Purchase {
  private purchaseData: IBuyer = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };

  savePurchase(data: IBuyer): void {
    this.purchaseData = {...data}
  }
  getPurchase(): IBuyer {
    return {...this.purchaseData};
  }
  clearePurchase(): void {
    this.purchaseData = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };
  };
  validate(): boolean {
    if (!this.purchaseData.payment) {
      return false;
    }

    if (!this.purchaseData.address.trim() || this.purchaseData.address.trim().length < 5) {
      return false;
    }

    const phoneRegex = /^(\+7|8)[\d\-\(\)\s]{10,15}$/;
    if (!this.purchaseData.phone.trim() || !phoneRegex.test(this.purchaseData.phone.replace(/\s/g, ''))) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.purchaseData.email.trim() || !emailRegex.test(this.purchaseData.email)) {
      return false;
    }

    return true;
  }
}