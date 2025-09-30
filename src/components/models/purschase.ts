import { IBuyer } from "../../types";
import { TPayment } from "../../types";

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
  
validateOrder(): string[] {
    const errors: string[] = [];
    if (this.purchaseData.payment !== 'card' && this.purchaseData.payment !== 'cash') {
        errors.push('Выберите способ оплаты');
    }
    if (this.purchaseData.address.trim() === '') {
        errors.push('Некорректный адрес');
    }
    
    return errors;
}

  validateContacts(): string[] {
    const errors: string[] = [];
    if (this.purchaseData.email.trim() === '') {
        errors.push('Некорректный Email');
    }
    if (this.purchaseData.phone.trim() === '') {
        errors.push('Некорректный номер телефона');
    }
    
    return errors;
  }
}