import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-gateway',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.html',
  styleUrl: './payment-gateway.scss',
})
export class PaymentGatewayComponent {
  @Input() orderTotal: number = 0;
  @Input() orderData: any = {};
  @Output() paymentComplete = new EventEmitter<any>();
  @Output() paymentCancelled = new EventEmitter<void>();

  selectedMethod: string = 'card';
  
  // Card details
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardholderName: string = '';
  
  // UPI details
  upiId: string = '';

  closePayment() {
    this.paymentCancelled.emit();
  }

  isPaymentValid(): boolean {
    switch (this.selectedMethod) {
      case 'card':
        return this.cardNumber.length >= 16 && 
               this.expiryDate.length === 5 && 
               this.cvv.length === 3 && 
               this.cardholderName.trim().length > 0;
      case 'upi':
        return this.upiId.includes('@') && this.upiId.length > 5;
      case 'cod':
        return true;
      default:
        return false;
    }
  }

  processPayment() {
    if (!this.isPaymentValid()) {
      alert('Please fill all required fields');
      return;
    }

    const paymentData = {
      method: this.selectedMethod,
      amount: this.orderTotal,
      orderData: this.orderData,
      paymentDetails: this.getPaymentDetails(),
      timestamp: new Date().toISOString(),
      transactionId: this.generateTransactionId()
    };

    // Simulate payment processing
    this.simulatePaymentProcess(paymentData);
  }

  getPaymentDetails() {
    switch (this.selectedMethod) {
      case 'card':
        return {
          cardNumber: this.maskCardNumber(this.cardNumber),
          cardholderName: this.cardholderName,
          expiryDate: this.expiryDate
        };
      case 'upi':
        return {
          upiId: this.upiId
        };
      case 'cod':
        return {
          paymentMode: 'Cash on Delivery'
        };
      default:
        return {};
    }
  }

  maskCardNumber(cardNumber: string): string {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  }

  generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  simulatePaymentProcess(paymentData: any) {
    // Show processing state
    const processingOverlay = document.createElement('div');
    processingOverlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 20000;">
        <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; color: #4caf50;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
          <h3>Processing Payment...</h3>
          <p>Please wait while we process your ${this.selectedMethod === 'cod' ? 'order' : 'payment'}</p>
        </div>
      </div>
    `;
    document.body.appendChild(processingOverlay);

    // Simulate processing delay
    setTimeout(() => {
      document.body.removeChild(processingOverlay);
      
      if (this.selectedMethod === 'cod' || Math.random() > 0.1) { // 90% success rate
        this.showSuccessMessage(paymentData);
        this.paymentComplete.emit(paymentData);
      } else {
        this.showErrorMessage();
      }
    }, 2000);
  }

  showSuccessMessage(paymentData: any) {
    const successOverlay = document.createElement('div');
    successOverlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 20000;">
        <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; color: #4caf50; max-width: 400px;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
          <h3>Payment Successful!</h3>
          <p><strong>Transaction ID:</strong> ${paymentData.transactionId}</p>
          <p>Your order has been placed successfully.</p>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #4caf50; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; margin-top: 1rem;">OK</button>
        </div>
      </div>
    `;
    document.body.appendChild(successOverlay);
  }

  showErrorMessage() {
    const errorOverlay = document.createElement('div');
    errorOverlay.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 20000;">
        <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center; color: #f44336; max-width: 400px;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">❌</div>
          <h3>Payment Failed!</h3>
          <p>There was an error processing your payment. Please try again.</p>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; cursor: pointer; margin-top: 1rem;">Try Again</button>
        </div>
      </div>
    `;
    document.body.appendChild(errorOverlay);
  }

  // Format card number input
  onCardNumberInput(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formattedValue;
  }

  // Format expiry date input
  onExpiryDateInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }
}