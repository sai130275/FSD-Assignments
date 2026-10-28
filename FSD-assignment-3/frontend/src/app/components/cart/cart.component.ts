import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  customerName = '';
  customerPhone = '';
  deliveryType: 'dine-in' | 'takeaway' = 'dine-in';
  specialInstructions = '';

  submitting = false;
  success = false;
  error = '';
  orderResult: any = null;

  constructor(public cartService: CartService, private api: ApiService) {}

  placeOrder(form: NgForm): void {
    if (form.invalid || this.cartService.items.length === 0) return;

    this.submitting = true;
    this.error = '';

    const payload = {
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      items: this.cartService.items.map((i) => ({
        menuItemId: i.menuItem._id,
        quantity: i.quantity
      })),
      specialInstructions: this.specialInstructions.trim(),
      deliveryType: this.deliveryType
    };

    this.api.placeOrder(payload).subscribe({
      next: (res) => {
        this.success = true;
        this.orderResult = res.data;
        this.cartService.clear();
        this.submitting = false;
        form.resetForm();
      },
      error: (err) => {
        this.error = err.error?.message || err.error?.errors?.[0]?.msg || 'Failed to place order. Please try again.';
        this.submitting = false;
      }
    });
  }

  reset(): void {
    this.success = false;
    this.orderResult = null;
    this.error = '';
  }
}
