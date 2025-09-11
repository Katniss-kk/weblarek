export class Purchase {
  private purchaseData: IBuyer = {
    payment: '' as TPayment,
    email: '',
    phone: '',
    address: ''
  };

  savePurchase(data: IBuyer): void {
    if (data.payment) {
      this.purchaseData.payment = data.payment
    } if (data.email) {
      this.purchaseData.email = data.email
    } if (data.phone) {
      this.purchaseData.phone = data.phone
    } if (data.address) {
      this.purchaseData.address = data.address
    }
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
  
  validate(data: IBuyer): string[] {
    const errors: string[] = [];
    
    if (!data.payment || !['online', 'credit'].includes(data.payment)) {
        errors.push('Выберите способ оплаты');
    }
    if (!data.email || !data.email.includes('@')) {
        errors.push('Некорректный Email');
    }
    if (!data.phone || data.phone.length < 9) {
        errors.push('Некорректный номер телефона');
    }
    if (!data.address || data.address.length < 5) {
        errors.push('Некорректный адрес');
    }
    
    if (errors.length === 0) {
        Object.assign(this.purchaseData, data);
    }
    
    return errors;
  }
}