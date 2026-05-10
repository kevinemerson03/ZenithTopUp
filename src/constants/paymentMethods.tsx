import React from 'react';
import { Wallet, Landmark, QrCode } from 'lucide-react';
import { PaymentMethod } from '../types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS', icon: <QrCode size={20} />, type: 'All E-Wallets & Banks' },
  { id: 'gopay', name: 'GoPay', icon: <Wallet size={20} />, type: 'E-Wallet' },
  { id: 'ovo', name: 'OVO', icon: <Wallet size={20} />, type: 'E-Wallet' },
  { id: 'shopeepay', name: 'ShopeePay', icon: <Wallet size={20} />, type: 'E-Wallet' },
  { id: 'va', name: 'Virtual Account', icon: <Landmark size={20} />, type: 'BCA, Mandiri, BNI' },
];
