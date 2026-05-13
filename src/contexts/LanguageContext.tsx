import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'nav.home': 'Home',
    'nav.history': 'History',
    'nav.settings': 'Settings',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.support': 'Support',
    'nav.search': 'Search for games or services...',
    'nav.notifications': 'Notifications',
    'nav.new': 'New',
    'nav.view_all': 'View All Activity',
    'hero.title': 'Zenith Digital Top-Up',
    'hero.subtitle': 'The most advanced digital goods engine. Top up your favorite games with absolute precision and speed.',
    'hero.featured': 'Zenith Exclusive',
    'hero.games_banner_title': 'TOP GAMING TITLES',
    'hero.games_banner_subtitle': 'Instant top-up for VALORANT, Genshin Impact, and more. Your game, your way.',
    'hero.trending': 'Trending',
    'hero.streaming_banner_title': 'PREMIUM STREAMING',
    'hero.streaming_banner_subtitle': 'Instant access to Spotify, Netflix, YouTube Premium and more. Secure and reliable.',
    'hero.entertainment': 'Entertainment',
    'hero.explore': 'Explore Now',
    'hero.promos': 'View Promos',
    'home.search_placeholder': 'Search for your favorite game or service...',
    'home.trending': 'Trending Now',
    'home.all_products': 'All Products',
    'home.games': 'Games',
    'home.subscriptions': 'Subscriptions',
    'home.no_results': 'No products found matching your search',
    'product.buy_now': 'Buy Now',
    'product.add_to_cart': 'Add to Cart',
    'product.select_amount': 'Select Amount',
    'product.enter_id': 'Enter User ID',
    'product.enter_zone': 'Enter Zone ID',
    'product.instant': 'INSTANT',
    'benefits.fast.title': 'Zenith Speed',
    'benefits.fast.desc': 'Automated systems ensure your top-up is delivered within seconds of payment confirmation.',
    'benefits.secure.title': 'Zenith Secure',
    'benefits.secure.desc': 'We use industry-standard encryption and official payment gateways to protect your data.',
    'benefits.support.title': 'Zenith Support',
    'benefits.support.desc': 'Our dedicated support team is available 24/7 to help you with any transaction issues.',
    'history.title': 'Transaction History',
    'history.subtitle': 'Track your digital top-up journey',
    'history.search_placeholder': 'Search transactions...',
    'history.no_transactions': 'No Transactions Yet',
    'history.no_results': 'No transactions found matching',
    'history.start_shopping': 'Start Shopping',
    'history.total_transactions': 'Total Transactions',
    'history.total_spent': 'Total Spent',
    'history.active_subs': 'Active Subscriptions',
    'topup.back': 'Back to Game Browser',
    'topup.official_partner': 'Official Partner',
    'topup.instant_delivery': 'Instant Delivery',
    'topup.instant_desc': 'Items will be sent directly to your account in seconds after payment verification.',
    'topup.secure_transaction': 'Secure Transaction',
    'topup.secure_desc': 'Your data is encrypted and protected by our high-security engine.',
    'topup.account_details': 'Account Details',
    'topup.credentials_desc': 'Enter your game credentials',
    'topup.user_id': 'User ID',
    'topup.zone_id': 'Zone ID',
    'topup.id_help': 'To find your User ID, tap on your avatar in the top left corner of the main game screen. The ID is usually a 8-10 digit number.',
    'topup.select_amount': 'Select Amount',
    'topup.package_desc': 'Choose your desired package',
    'topup.payment_method': 'Payment Method',
    'topup.gateway_desc': 'Select your preferred gateway',
    'topup.summary': 'Summary',
    'topup.product': 'Product',
    'topup.package': 'Package',
    'topup.total': 'Total',
    'topup.pay_now': 'Pay Now',
    'topup.add_to_cart': 'Add to Cart',
    'topup.processing': 'Processing...',
    'topup.checkout_now': 'Checkout Now',
    'topup.success_title': 'Transaction Success!',
    'topup.success_desc': 'Your top up has been processed successfully. The items will appear in your account shortly.',
    'topup.view_history': 'View History',
    'topup.close': 'Close',
    'cart.title': 'Your Cart',
    'cart.back': 'Back to Store',
    'cart.velocity_cart': 'YOUR ZENITH CART',
    'cart.total_items': 'Total Items',
    'cart.packages': 'Packages',
    'cart.empty_title': 'The Cart is Empty',
    'cart.empty_desc': "Your journey hasn't started yet. Browse our selection of games and subscriptions to fuel your digital life.",
    'cart.explore': 'Explore Products',
    'cart.items_queue': 'Items in Queue',
    'cart.clear_all': 'Clear All',
    'cart.bulk_title': 'Zenith Bulk Top-Up',
    'cart.bulk_desc': 'All items in your cart will be processed simultaneously. Our engine handles multiple transactions with absolute precision.',
    'cart.order_summary': 'Order Summary',
    'cart.subtotal': 'Subtotal',
    'cart.admin_fee': 'Admin Fee',
    'cart.checkout_all': 'Checkout All',
    'cart.encrypted': 'Encrypted',
    'cart.instant': 'Instant',
    'cart.success_title': 'ZENITH REACHED!',
    'cart.success_desc': 'All top-ups have been processed. Check your transaction history for details.',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'cart.total': 'Total',
  },
  id: {
    'nav.home': 'Beranda',
    'nav.history': 'Riwayat',
    'nav.settings': 'Pengaturan',
    'nav.login': 'Masuk',
    'nav.logout': 'Keluar',
    'nav.support': 'Dukungan',
    'nav.search': 'Cari game atau layanan...',
    'nav.notifications': 'Notifikasi',
    'nav.new': 'Baru',
    'nav.view_all': 'Lihat Semua Aktivitas',
    'hero.title': 'Top-Up Digital Zenith',
    'hero.subtitle': 'Mesin barang digital tercanggih. Top up game favorit Anda dengan presisi dan kecepatan mutlak.',
    'hero.featured': 'Eksklusif Zenith',
    'hero.games_banner_title': 'JUDUL GAME TERRELEVAN',
    'hero.games_banner_subtitle': 'Top-up instan untuk VALORANT, Genshin Impact, dan lainnya. Game Anda, cara Anda.',
    'hero.trending': 'Sedang Tren',
    'hero.streaming_banner_title': 'STREAMING PREMIUM',
    'hero.streaming_banner_subtitle': 'Akses instan ke Spotify, Netflix, YouTube Premium dan banyak lagi. Aman dan terpercaya.',
    'hero.entertainment': 'Hiburan',
    'hero.explore': 'Jelajahi Sekarang',
    'hero.promos': 'Lihat Promo',
    'home.search_placeholder': 'Cari game atau layanan favorit Anda...',
    'home.trending': 'Sedang Tren',
    'home.all_products': 'Semua Produk',
    'home.games': 'Game',
    'home.subscriptions': 'Langganan',
    'home.no_results': 'Tidak ada produk yang cocok dengan pencarian Anda',
    'product.buy_now': 'Beli Sekarang',
    'product.add_to_cart': 'Tambah ke Keranjang',
    'product.select_amount': 'Pilih Jumlah',
    'product.enter_id': 'Masukkan ID Pengguna',
    'product.enter_zone': 'Masukkan ID Zona',
    'product.instant': 'INSTAN',
    'benefits.fast.title': 'Kecepatan Zenith',
    'benefits.fast.desc': 'Sistem otomatis memastikan top-up Anda terkirim dalam hitungan detik setelah konfirmasi pembayaran.',
    'benefits.secure.title': 'Keamanan Zenith',
    'benefits.secure.desc': 'Kami menggunakan enkripsi standar industri dan gerbang pembayaran resmi untuk melindungi data Anda.',
    'benefits.support.title': 'Dukungan Zenith',
    'benefits.support.desc': 'Tim dukungan khusus kami tersedia 24/7 untuk membantu Anda dengan masalah transaksi apa pun.',
    'history.title': 'Riwayat Transaksi',
    'history.subtitle': 'Lacak perjalanan top-up digital Anda',
    'history.search_placeholder': 'Cari transaksi...',
    'history.no_transactions': 'Belum Ada Transaksi',
    'history.no_results': 'Tidak ada transaksi yang cocok dengan',
    'history.start_shopping': 'Mulai Belanja',
    'history.total_transactions': 'Total Transaksi',
    'history.total_spent': 'Total Pengeluaran',
    'history.active_subs': 'Langganan Aktif',
    'topup.back': 'Kembali ke Browser Game',
    'topup.official_partner': 'Mitra Resmi',
    'topup.instant_delivery': 'Pengiriman Instan',
    'topup.instant_desc': 'Item akan dikirim langsung ke akun Anda dalam hitungan detik setelah verifikasi pembayaran.',
    'topup.secure_transaction': 'Transaksi Aman',
    'topup.secure_desc': 'Data Anda dienkripsi dan dilindungi oleh mesin keamanan tinggi kami.',
    'topup.account_details': 'Detail Akun',
    'topup.credentials_desc': 'Masukkan kredensial game Anda',
    'topup.user_id': 'ID Pengguna',
    'topup.zone_id': 'ID Zona',
    'topup.id_help': 'Untuk menemukan ID Pengguna Anda, ketuk avatar Anda di pojok kiri atas layar utama game. ID biasanya berupa angka 8-10 digit.',
    'topup.select_amount': 'Pilih Jumlah',
    'topup.package_desc': 'Pilih paket yang Anda inginkan',
    'topup.payment_method': 'Metode Pembayaran',
    'topup.gateway_desc': 'Pilih gerbang pembayaran pilihan Anda',
    'topup.summary': 'Ringkasan',
    'topup.product': 'Produk',
    'topup.package': 'Paket',
    'topup.total': 'Total',
    'topup.pay_now': 'Bayar Sekarang',
    'topup.add_to_cart': 'Tambah ke Keranjang',
    'topup.processing': 'Memproses...',
    'topup.checkout_now': 'Checkout Sekarang',
    'topup.success_title': 'Transaksi Berhasil!',
    'topup.success_desc': 'Top up Anda telah berhasil diproses. Item akan segera muncul di akun Anda.',
    'topup.view_history': 'Lihat Riwayat',
    'topup.close': 'Tutup',
    'cart.title': 'Keranjang Anda',
    'cart.back': 'Kembali ke Toko',
    'cart.velocity_cart': 'KERANJANG ZENITH ANDA',
    'cart.total_items': 'Total Item',
    'cart.packages': 'Paket',
    'cart.empty_title': 'Keranjang Kosong',
    'cart.empty_desc': 'Perjalanan Anda belum dimulai. Jelajahi pilihan game dan langganan kami untuk mengisi kehidupan digital Anda.',
    'cart.explore': 'Jelajahi Produk',
    'cart.items_queue': 'Item dalam Antrean',
    'cart.clear_all': 'Hapus Semua',
    'cart.bulk_title': 'Top-Up Zenith Massal',
    'cart.bulk_desc': 'Semua item di keranjang Anda akan diproses secara bersamaan. Mesin kami menangani beberapa transaksi dengan presisi mutlak.',
    'cart.order_summary': 'Ringkasan Pesanan',
    'cart.subtotal': 'Subtotal',
    'cart.admin_fee': 'Biaya Admin',
    'cart.checkout_all': 'Checkout Semua',
    'cart.encrypted': 'Terenkripsi',
    'cart.instant': 'Instan',
    'cart.success_title': 'ZENITH TERCAPAI!',
    'cart.success_desc': 'Semua top-up telah diproses. Periksa riwayat transaksi Anda untuk detailnya.',
    'cart.empty': 'Keranjang Anda kosong',
    'cart.checkout': 'Bayar',
    'cart.total': 'Total',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language');
      return (saved === 'en' || saved === 'id') ? saved : 'en';
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
