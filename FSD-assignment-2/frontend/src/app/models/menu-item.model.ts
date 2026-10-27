export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  isVegetarian: boolean;
  isSpicy: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}
