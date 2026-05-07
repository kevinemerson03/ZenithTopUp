import { Product } from './types';

export const GAMES: Product[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    image: 'https://i.ibb.co.com/nMp7rZ12/1.png',
    category: 'game',
    publisher: 'Moonton',
    promoLabel: '5% OFF',
    denominations: [
      { id: 'ml1', amount: '86 Diamonds', price: 24000, bonus: '+10 Bonus' },
      { id: 'ml2', amount: '172 Diamonds', price: 48000, bonus: '+20 Bonus' },
      { id: 'ml3', amount: '257 Diamonds', price: 72000, bonus: '+30 Bonus' },
      { id: 'ml4', amount: '706 Diamonds', price: 185000, bonus: '+80 Bonus' },
      { id: 'ml5', amount: '2195 Diamonds', price: 550000, bonus: '+250 Bonus' },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    image: 'https://i.ibb.co.com/mCfWCDhf/2.png',
    category: 'game',
    publisher: 'Roblox Corporation',
    denominations: [
      { id: 'rb1', amount: '400 Robux', price: 75000 },
      { id: 'rb2', amount: '800 Robux', price: 150000 },
      { id: 'rb3', amount: '1700 Robux', price: 300000 },
      { id: 'rb4', amount: '4500 Robux', price: 750000 },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    image: 'https://i.ibb.co.com/1YG4cCvR/3.png',
    category: 'game',
    publisher: 'Riot Games',
    denominations: [
      { id: 'val1', amount: '475 VP', price: 50000 },
      { id: 'val2', amount: '1000 VP', price: 100000 },
      { id: 'val3', amount: '2050 VP', price: 200000 },
      { id: 'val4', amount: '5350 VP', price: 500000 },
    ]
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    image: 'https://i.ibb.co.com/dwNHLB5T/4.png',
    category: 'game',
    publisher: 'Tencent Games',
    denominations: [
      { id: 'pub1', amount: '60 UC', price: 15000 },
      { id: 'pub2', amount: '325 UC', price: 75000 },
      { id: 'pub3', amount: '660 UC', price: 150000 },
      { id: 'pub4', amount: '1800 UC', price: 375000 },
    ]
  },
  {
    id: 'ff',
    name: 'Free Fire',
    image: 'https://i.ibb.co.com/q31y1WYV/5.png',
    category: 'game',
    publisher: 'Garena',
    denominations: [
      { id: 'ff1', amount: '100 Diamonds', price: 15000 },
      { id: 'ff2', amount: '310 Diamonds', price: 45000 },
      { id: 'ff3', amount: '520 Diamonds', price: 75000 },
      { id: 'ff4', amount: '1060 Diamonds', price: 150000 },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    image: 'https://i.ibb.co.com/B55wnnTB/6.png',
    category: 'game',
    publisher: 'HoYoverse',
    denominations: [
      { id: 'gi1', amount: '60 Genesis Crystals', price: 15000 },
      { id: 'gi2', amount: '300 Genesis Crystals', price: 75000 },
      { id: 'gi3', amount: '980 Genesis Crystals', price: 225000 },
      { id: 'gi4', amount: '1980 Genesis Crystals', price: 450000 },
    ]
  }
];

export const SUBSCRIPTIONS: Product[] = [
  {
    id: 'spotify',
    name: 'Spotify Premium',
    image: 'https://i.ibb.co.com/7tt7YSBg/7.png',
    category: 'subscription',
    publisher: 'Spotify',
    promoLabel: 'BEST VALUE',
    denominations: [
      { id: 'sp1', amount: '1 Month Individual', price: 54990 },
      { id: 'sp2', amount: '3 Months Individual', price: 164970 },
      { id: 'sp3', amount: '1 Month Family', price: 86900 },
    ]
  },
  {
    id: 'netflix',
    name: 'Netflix',
    image: 'https://i.ibb.co.com/DDxFYtNL/8.png',
    category: 'subscription',
    publisher: 'Netflix',
    denominations: [
      { id: 'nf1', amount: 'Mobile Plan (1 Month)', price: 54000 },
      { id: 'nf2', amount: 'Basic Plan (1 Month)', price: 120000 },
      { id: 'nf3', amount: 'Standard Plan (1 Month)', price: 153000 },
      { id: 'nf4', amount: 'Premium Plan (1 Month)', price: 186000 },
    ]
  },
  {
    id: 'viu',
    name: 'Viu Premium',
    image: 'https://i.ibb.co.com/TMh4TcSW/9.png',
    category: 'subscription',
    publisher: 'Viu',
    denominations: [
      { id: 'viu1', amount: '1 Month Premium', price: 33000 },
      { id: 'viu2', amount: '3 Months Premium', price: 77000 },
    ]
  },
  {
    id: 'wetv',
    name: 'Tencent VIP',
    image: 'https://i.ibb.co.com/KzmL3MP9/10.png',
    category: 'subscription',
    publisher: 'Tencent',
    denominations: [
      { id: 'wtv1', amount: '1 Month VIP', price: 35000 },
      { id: 'wtv2', amount: '1 Year VIP', price: 359000 },
    ]
  },
  {
    id: 'ytp',
    name: 'YouTube Premium',
    image: 'https://i.ibb.co.com/xtXCJYTd/11.png',
    category: 'subscription',
    publisher: 'Google',
    denominations: [
      { id: 'yt1', amount: '1 Month Individual', price: 59000 },
      { id: 'yt2', amount: '1 Month Family', price: 99000 },
    ]
  },
  {
    id: 'disney',
    name: 'Disney+ Hotstar',
    image: 'https://i.ibb.co.com/wN6qsnzJ/12.png',
    category: 'subscription',
    publisher: 'Disney',
    promoLabel: 'PROMO',
    denominations: [
      { id: 'ds1', amount: '1 Month Basic', price: 65000 },
      { id: 'ds2', amount: '1 Year Basic', price: 450000 },
    ]
  }
];
