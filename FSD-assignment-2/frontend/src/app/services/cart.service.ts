import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem, CartItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  get items(): CartItem[] {
    return this.cartSubject.value;
  }

  get totalItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  get totalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  }

  addItem(menuItem: MenuItem): void {
    const current = [...this.items];
    const idx = current.findIndex((i) => i.menuItem._id === menuItem._id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + 1 };
    } else {
      current.push({ menuItem, quantity: 1 });
    }
    this.cartSubject.next(current);
  }

  removeItem(menuItemId: string): void {
    this.cartSubject.next(this.items.filter((i) => i.menuItem._id !== menuItemId));
  }

  updateQuantity(menuItemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(menuItemId);
      return;
    }
    const current = this.items.map((i) =>
      i.menuItem._id === menuItemId ? { ...i, quantity } : i
    );
    this.cartSubject.next(current);
  }

  clear(): void {
    this.cartSubject.next([]);
  }
}
