export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'coffee' | 'non-coffee' | 'main-course' | 'snack' | 'refresher';
  description: string;
  image: string;
  variants?: { name: string; price: number }[];
}

export const MENU_ITEMS: MenuItem[] = [
  // ==========================================
  // COFFEE SELECTION (Panas / Dingin)
  // ==========================================
  {
    id: 'kopi-kapal-api',
    name: 'Kopi Kapal Api',
    price: 6000,
    category: 'coffee',
    description: 'Kopi hitam legendaris Kapal Api aromatik dan pekat.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 6000 },
      { name: 'Dingin', price: 8000 }
    ]
  },
  {
    id: 'kopi-gajah-tubruk',
    name: 'Kopi Gajah Tubruk',
    price: 6000,
    category: 'coffee',
    description: 'Kopi tubruk tradisional dengan ampas mantap dan wangi klasik.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 6000 },
      { name: 'Dingin', price: 8000 }
    ]
  },
  {
    id: 'kopi-liong',
    name: 'Kopi Liong',
    price: 8000,
    category: 'coffee',
    description: 'Kopi khas Bogor legendaris dengan aroma super tajam dan rasa khas.',
    image: 'https://images.unsplash.com/photo-1568649929103-28fffecca3a6?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'indocafe-mix',
    name: 'Indocafe Mix',
    price: 6000,
    category: 'coffee',
    description: 'Kopi 3-in-1 instan perpaduan pas kopi, krimer, dan gula manis.',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 6000 },
      { name: 'Dingin', price: 8000 }
    ]
  },
  {
    id: 'abc-susu',
    name: 'ABC Susu',
    price: 8000,
    category: 'coffee',
    description: 'Kopi instan ABC manis dengan paduan susu yang gurih.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'luwak-white-coffee',
    name: 'Luwak White Coffee',
    price: 8000,
    category: 'coffee',
    description: 'Kopi putih ramah lambung dengan rasa creamy and manis lembut.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'abc-klepon',
    name: 'ABC Klepon',
    price: 8000,
    category: 'coffee',
    description: 'Sensasi unik kopi susu beraroma pandan dan gula merah khas klepon.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'abc-mocca',
    name: 'ABC Mocca',
    price: 8000,
    category: 'coffee',
    description: 'Kopi instan beraroma cokelat moka yang lezat dan nikmat.',
    image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'goodday-mocacinno',
    name: 'GoodDay Mocacinno',
    price: 8000,
    category: 'coffee',
    description: 'Kopi gaul dengan cokelat moka manis berbusa lembut.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'goodday-chococinno',
    name: 'GoodDay Chococinno',
    price: 8000,
    category: 'coffee',
    description: 'Kopi instan dengan rasa cokelat chococinno gurih manis mantap.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'goodday-cappuccino',
    name: 'GoodDay Cappuccino',
    price: 8000,
    category: 'coffee',
    description: 'Kopi kapucino instan wangi dengan taburan choco granule di atasnya.',
    image: 'https://images.unsplash.com/photo-1557006021-b85abd7becb6?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'goodday-freeze',
    name: 'GoodDay Freeze',
    price: 8000,
    category: 'coffee',
    description: 'Kopi dingin menyegarkan dengan sensasi dingin mint cokelat.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'creamy-latte',
    name: 'Creamy Latte',
    price: 8000,
    category: 'coffee',
    description: 'Kopi susu super lembut, sangat cocok untuk bersantai.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'americano',
    name: 'Americano',
    price: 10000,
    category: 'coffee',
    description: 'Kopi espresso hitam murni tanpa gula yang kuat dan segar.',
    image: 'https://images.unsplash.com/photo-1551046713-bc47f96210dd?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 10000 },
      { name: 'Dingin', price: 12000 }
    ]
  },

  // ==========================================
  // CHOCOLATE & MILK (non-coffee)
  // ==========================================
  {
    id: 'milo',
    name: 'Milo',
    price: 8000,
    category: 'non-coffee',
    description: 'Cokelat malt legendaris bergizi tinggi disukai semua kalangan.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'chocolatos-coklat',
    name: 'Chocolatos Coklat',
    price: 8000,
    category: 'non-coffee',
    description: 'Minuman cokelat Italia premium Chocolatos rasa tebal memanjakan.',
    image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'chocolatos-vanila',
    name: 'Chocolatos Vanila',
    price: 8000,
    category: 'non-coffee',
    description: 'Minuman rasa vanila manis harum nan lembut dari Chocolatos.',
    image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'chocolatos-matcha',
    name: 'Chocolatos Matcha',
    price: 8000,
    category: 'non-coffee',
    description: 'Minuman teh hijau Jepang Matcha manis legit aromatik khas Chocolatos.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'drink-beng-beng',
    name: 'Drink Beng Beng',
    price: 8000,
    category: 'non-coffee',
    description: 'Minuman cokelat dengan cita rasa khas wafer karamel Beng Beng.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'susu-jahe',
    name: 'Susu Jahe',
    price: 6000,
    category: 'non-coffee',
    description: 'Seduhan jahe merah bakar hangat pedas berpadu susu kental manis.',
    image: 'https://images.unsplash.com/photo-1594911774802-8822a707c93e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'frisian-flag-coklat',
    name: 'Frisian Flag Coklat',
    price: 6000,
    category: 'non-coffee',
    description: 'Susu kental manis cokelat Frisian Flag klasik.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 6000 },
      { name: 'Dingin', price: 7000 }
    ]
  },
  {
    id: 'frisian-flag-putih',
    name: 'Frisian Flag Putih',
    price: 6000,
    category: 'non-coffee',
    description: 'Susu kental manis putih Frisian Flag gurih.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 6000 },
      { name: 'Dingin', price: 7000 }
    ]
  },
  {
    id: 'dancow',
    name: 'Dancow',
    price: 10000,
    category: 'non-coffee',
    description: 'Susu bubuk Dancow full cream super gurih kaya rasa.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 10000 },
      { name: 'Dingin', price: 12000 }
    ]
  },
  {
    id: 'teh-tarik',
    name: 'Teh Tarik',
    price: 8000,
    category: 'non-coffee',
    description: 'Perpaduan teh hitam harum dan susu kental manis yang ditarik berbusa.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'ovaltine',
    name: 'Ovaltine',
    price: 8000,
    category: 'non-coffee',
    description: 'Susu cokelat Ovaltine dengan rasa malt premium manis legit.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },
  {
    id: 'extra-joss-susu',
    name: 'Extra Joss Susu',
    price: 12000,
    category: 'non-coffee',
    description: 'Minuman energi Extra Joss dingin dicampur susu kental manis gurih.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kuku-bima-susu',
    name: 'Kuku Bima Susu',
    price: 12000,
    category: 'non-coffee',
    description: 'Minuman energi Kuku Bima rasa buah segar berpadu susu manis.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'hilo-chocolate',
    name: 'Hilo Chocolate',
    price: 8000,
    category: 'non-coffee',
    description: 'Minuman susu cokelat Hilo tinggi kalsium kaya vitamin rasa lezat.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 8000 },
      { name: 'Dingin', price: 10000 }
    ]
  },

  // ==========================================
  // NUTRISARI SELECTION (refreshers)
  // ==========================================
  {
    id: 'sweet-orange',
    name: 'Nutrisari Sweet Orange',
    price: 8000,
    category: 'refresher',
    description: 'Minuman jeruk manis Nutrisari kaya vitamin C dingin menyegarkan.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab80260f42c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jeruk-peras',
    name: 'Nutrisari Jeruk Peras',
    price: 8000,
    category: 'refresher',
    description: 'Rasa jeruk peras lokal asam manis segar menggugah selera.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab80260f42c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jeruk-nipis',
    name: 'Nutrisari Jeruk Nipis',
    price: 8000,
    category: 'refresher',
    description: 'Sensasi asam jeruk nipis murni yang super segar membasuh dahaga.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'milky-orange',
    name: 'Nutrisari Milky Orange',
    price: 8000,
    category: 'refresher',
    description: 'Perpaduan jeruk buah manis dan kelembutan rasa susu creamy.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'blewah',
    name: 'Nutrisari Blewah',
    price: 8000,
    category: 'refresher',
    description: 'Rasa buah blewah khas buka puasa yang manis menyegarkan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'semangka',
    name: 'Nutrisari Semangka',
    price: 8000,
    category: 'refresher',
    description: 'Kesegaran rasa buah semangka merah berair dingin di tenggorokan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'anggur',
    name: 'Nutrisari Anggur',
    price: 8000,
    category: 'refresher',
    description: 'Sensasi manis segar eksotis buah anggur ungu pilihan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mangga',
    name: 'Nutrisari Mangga',
    price: 8000,
    category: 'refresher',
    description: 'Manisnya mangga harum manis tropis yang matang sempurna.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab80260f42c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'lychee',
    name: 'Nutrisari Lychee',
    price: 8000,
    category: 'refresher',
    description: 'Wangi harum manis buah leci merah dingin menyegarkan hari Anda.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'cincau',
    name: 'Nutrisari Cincau',
    price: 8000,
    category: 'refresher',
    description: 'Rasa cincau hitam tradisional menyejukkan penurun panas dalam.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'jambu',
    name: 'Nutrisari Jambu',
    price: 8000,
    category: 'refresher',
    description: 'Minuman rasa jambu biji merah manis wangi segar berenergi.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },

  // ==========================================
  // MAINCOURSE (main-course)
  // ==========================================
  {
    id: 'indomie',
    name: 'Indomie (Goreng/Rebus)',
    price: 9000,
    category: 'main-course',
    description: 'Indomie instan favorit (pilihan Goreng atau Rebus polos).',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'indomie-telur',
    name: 'Indomie + Telur',
    price: 12000,
    category: 'main-course',
    description: 'Indomie instan Goreng / Rebus disajikan dengan telur matang hangat.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'indomie-double',
    name: 'Indomie Double',
    price: 14000,
    category: 'main-course',
    description: 'Porsi ganda (2 bungkus) Indomie instan tanpa telur untuk rasa puas maksimal.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'indomie-double-telur',
    name: 'Indomie Double + Telur',
    price: 16000,
    category: 'main-course',
    description: 'Dua bungkus Indomie instan jumbo komplit disajikan dengan sebutir telur hangat.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mie-nyemek',
    name: 'Mie Nyemek Warkop',
    price: 20000,
    category: 'main-course',
    description: 'Indomie dimasak basah nyemek dengan bumbu pedas, telur orak-arik, sayuran, dan irisan cabai.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'spaghetti',
    name: 'Spaghetti',
    price: 15000,
    category: 'main-course',
    description: 'Pasta spaghetti disiram saus bolognese asam manis gurih tabur keju.',
    image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-goreng-biasa',
    name: 'Nasi Goreng Biasa',
    price: 18000,
    category: 'main-course',
    description: 'Nasi goreng bumbu racikan rumahan gurih khas warkop, dilengkapi kerupuk.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-goreng-sosis',
    name: 'Nasi Goreng Sosis',
    price: 19000,
    category: 'main-course',
    description: 'Nasi goreng wangi khas dengan potongan sosis sapi melimpah.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-goreng-baso',
    name: 'Nasi Goreng Baso',
    price: 19000,
    category: 'main-course',
    description: 'Nasi goreng gurih dengan topping irisan bakso sapi kenyal.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-goreng-baso-sosis',
    name: 'Nasi Goreng Baso + Sosis',
    price: 22000,
    category: 'main-course',
    description: 'Kombinasi nasi goreng komplit bertabur potongan bakso sapi dan sosis gurih.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-goreng-spesial',
    name: 'Nasi Goreng Spesial',
    price: 25000,
    category: 'main-course',
    description: 'Nasi goreng komplit dengan sosis, bakso sapi, dan topping telur dadar/mata sapi.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kwetiau-rembus-goreng',
    name: 'Kwetiau (Rebus/Goreng)',
    price: 18000,
    category: 'main-course',
    description: 'Kwetiau beras kenyal dimasak Goreng manis gurih atau Kuah Rebus hangat.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-gila-astha',
    name: 'Nasi Gila Astha',
    price: 25000,
    category: 'main-course',
    description: 'Nasi putih disajikan dengan tumisan super pedas manis bakso, sosis, telur, dan ayam orak-arik gila.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nasi-teriyaki-ayam',
    name: 'Nasi Teriyaki Ayam',
    price: 18000,
    category: 'main-course',
    description: 'Nasi dengan tumisan ayam bumbu teriyaki khas Jepang manis gurih.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'
  },

  // ==========================================
  // SNACKS, PANCONG & LIGHT MEALS (snack)
  // ==========================================
  // PANCONG 8K BASE WITH TOPPINGS
  {
    id: 'pancong-coklat',
    name: 'Pancong Coklat',
    price: 12000,
    category: 'snack',
    description: 'Kue pancong khas lumer empuk gurih berselimut taburan meses cokelat manis (Base 8K + 4K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-keju',
    name: 'Pancong Keju',
    price: 13000,
    category: 'snack',
    description: 'Kue pancong lumer tradisional bertabur keju cheddar parut melimpah (Base 8K + 5K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-strawberry',
    name: 'Pancong Strawberry',
    price: 13000,
    category: 'snack',
    description: 'Kue pancong lumer disiram selai stroberi manis asam segar (Base 8K + 5K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-taro',
    name: 'Pancong Taro',
    price: 13000,
    category: 'snack',
    description: 'Kue pancong manis dengan glaze rasa taro talas ungu legit (Base 8K + 5K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-choco-crunchy',
    name: 'Pancong Choco Crunchy',
    price: 14000,
    category: 'snack',
    description: 'Kue pancong kekinian bersiram cokelat lumer krispi crunchy menggoda (Base 8K + 6K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-tiramisu',
    name: 'Pancong Tiramisu',
    price: 14000,
    category: 'snack',
    description: 'Kue pancong dengan olesan glaze tiramisu kopi manis aromatik (Base 8K + 6K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-matcha',
    name: 'Pancong Matcha',
    price: 15000,
    category: 'snack',
    description: 'Kue pancong lumer disiram saus matcha hijau manis gurih wangi teh hijau (Base 8K + 7K).',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  // PANCONG PREMIUM
  {
    id: 'pancong-lotus-biscoff',
    name: 'Pancong Lotus Biscoff',
    price: 18000,
    category: 'snack',
    description: 'Kue pancong premium bersiram selai speculoos Lotus Biscoff manis karamel rempah.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-kitkat',
    name: 'Pancong Kit Kat',
    price: 18000,
    category: 'snack',
    description: 'Kue pancong premium bertabur remahan cokelat wafer Kit Kat renyah.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pancong-ovaltine',
    name: 'Pancong Ovaltine',
    price: 18000,
    category: 'snack',
    description: 'Kue pancong premium bertabur bubuk cokelat Ovaltine tebal bergizi.',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop'
  },
  // ROTI PANGGANG (ROPANG)
  {
    id: 'ropang-coklat',
    name: 'Ropang Coklat',
    price: 13000,
    category: 'snack',
    description: 'Roti panggang mentega isi cokelat meses manis panggang wangi.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-keju',
    name: 'Ropang Keju',
    price: 15000,
    category: 'snack',
    description: 'Roti panggang mentega dengan parutan keju gurih melimpah.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-coklat-keju-susu',
    name: 'Ropang Coklat Keju Susu',
    price: 18000,
    category: 'snack',
    description: 'Menu favorit! Roti bakar bertabur cokelat meses, parutan keju, dan siraman kental manis.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-blueberry',
    name: 'Ropang Blueberry',
    price: 15000,
    category: 'snack',
    description: 'Roti panggang mentega isi selai buah blueberry manis asam segar.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-strawberry',
    name: 'Ropang Strawberry',
    price: 15000,
    category: 'snack',
    description: 'Roti panggang mentega isi selai stroberi merah manis segar.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-blueberry-keju',
    name: 'Ropang Blueberry Keju',
    price: 15000,
    category: 'snack',
    description: 'Roti bakar isi selai blueberry manis berpadu gurihnya keju parut.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-blueberry-coklat',
    name: 'Ropang Blueberry Coklat',
    price: 15000,
    category: 'snack',
    description: 'Roti bakar dengan olesan selai blueberry manis dan cokelat meses.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-strawberry-keju',
    name: 'Ropang Strawberry Keju',
    price: 15000,
    category: 'snack',
    description: 'Roti bakar mentega isi selai stroberi segar tabur keju parut.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'ropang-strawberry-coklat',
    name: 'Ropang Strawberry Coklat',
    price: 15000,
    category: 'snack',
    description: 'Roti bakar manis isi selai stroberi merah dan taburan cokelat meses.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop'
  },
  // PISANG PANGGANG
  {
    id: 'pisang-panggang-susu',
    name: 'Pisang Panggang Susu',
    price: 10000,
    category: 'snack',
    description: 'Pisang panggang mentega manis gurih disiram kental manis lezat.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pisang-panggang-coklat',
    name: 'Pisang Panggang Coklat',
    price: 14000,
    category: 'snack',
    description: 'Pisang panggang manis diselimuti taburan cokelat meses melimpah.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pisang-panggang-keju',
    name: 'Pisang Panggang Keju',
    price: 15000,
    category: 'snack',
    description: 'Pisang kepok panggang mentega ditaburi keju parut gurih.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'pisang-panggang-coklat-keju',
    name: 'Pisang Panggang Coklat Keju',
    price: 17000,
    category: 'snack',
    description: 'Menu favorit! Pisang panggang bertabur cokelat meses manis dan parutan keju gurih.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  // CEMILAN LAINNYA
  {
    id: 'otak-otak',
    name: 'Otak Otak',
    price: 13000,
    category: 'snack',
    description: 'Otak-otak ikan goreng gurih kenyal renyah, disajikan dengan saus sambal.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'sosis',
    name: 'Sosis',
    price: 13000,
    category: 'snack',
    description: 'Sosis sapi goreng gurih dengan saus sambal cocolan.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'kentang',
    name: 'Kentang',
    price: 15000,
    category: 'snack',
    description: 'Kentang goreng renyah bumbu asin gurih hangat.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mix-platter',
    name: 'Mix Platter',
    price: 20000,
    category: 'snack',
    description: 'Kombinasi kentang goreng renyah, sosis sapi, dan otak-otak gurih.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'cireng',
    name: 'Cireng',
    price: 15000,
    category: 'snack',
    description: 'Aci goreng garing kenyal hangat disajikan dengan saus bumbu rujak pedas manis.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'
  }
];
