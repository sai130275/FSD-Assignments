import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  categories: string[] = ['All'];
  selectedCategory = 'All';
  loading = true;
  error = '';
  addedIds = new Set<string>();

  constructor(private api: ApiService, public cartService: CartService) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.loading = true;
    this.error = '';
    this.api.getMenu().subscribe({
      next: (res) => {
        this.menuItems = res.data;
        this.filteredItems = res.data;
        const cats = [...new Set(res.data.map((i) => i.category))];
        this.categories = ['All', ...cats];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load menu. Make sure the backend is running.';
        this.loading = false;
      }
    });
  }

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filteredItems = cat === 'All'
      ? this.menuItems
      : this.menuItems.filter((i) => i.category === cat);
  }

  addToCart(item: MenuItem): void {
    this.cartService.addItem(item);
    this.addedIds.add(item._id);
    setTimeout(() => this.addedIds.delete(item._id), 1200);
  }

  getQuantityInCart(id: string): number {
    const found = this.cartService.items.find((i) => i.menuItem._id === id);
    return found ? found.quantity : 0;
  }
}
