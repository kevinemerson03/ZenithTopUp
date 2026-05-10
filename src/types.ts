export interface Product {
  id: string;
  name: string;
  image: string;
  category: 'game' | 'subscription';
  publisher: string;
  description?: string;
  promoLabel?: string;
  denominations: {
    id: string;
    amount: string;
    price: number;
    bonus?: string;
  }[];
}

export interface User {
  uid: string;
  email: string;
  name: string;
  phone: string;
  username?: string;
  nexusIds?: { gameId: string; nexusId: string; zoneId?: string }[];
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  amount: string;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  targetId?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  denomId: string;
  amount: string;
  price: number;
  userId: string;
  zoneId?: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  image: string;
  code: string;
  discount: string;
  expiryDate: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: string;
}
