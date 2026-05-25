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
  // COFFEE SELECTION
  {
    id: 'c1',
    name: 'Espresso (Single)',
    price: 18000,
    category: 'coffee',
    description: 'Ekstraksi murni dari biji kopi Arabika pilihan panggang gelap, intens dan mantap.',
    image: 'https://images.unsplash.com/photo-1510701114205-0cff478950f5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c2',
    name: 'Espresso (Double)',
    price: 22000,
    category: 'coffee',
    description: 'Ekstraksi ganda kopi Arabika pilihan untuk rasa espresso yang lebih pekat dan berenergi.',
    image: 'https://images.unsplash.com/photo-1510701114205-0cff478950f5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c3',
    name: 'Americano',
    price: 25000,
    category: 'coffee',
    description: 'Espresso double shot dengan air murni, menghasilkan rasa kopi hitam klasik yang bersih dan segar.',
    image: 'https://images.unsplash.com/photo-1551046713-bc47f96210dd?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 25000 },
      { name: 'Dingin', price: 27000 }
    ]
  },
  {
    id: 'c4',
    name: 'Cappuccino',
    price: 30000,
    category: 'coffee',
    description: 'Keseimbangan espresso, susu hangat lembut, dan busa susu tebal yang mewah bertabur bubuk cokelat.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 30000 },
      { name: 'Dingin', price: 32000 }
    ]
  },
  {
    id: 'c5',
    name: 'Cafe Latte',
    price: 30000,
    category: 'coffee',
    description: 'Espresso Arabika premium yang dipadukan dengan susu hangat berbusa tipis (steamed milk) yang creamy.',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 30000 },
      { name: 'Dingin', price: 32000 }
    ]
  },
  {
    id: 'c6',
    name: 'Flat White (Hot)',
    price: 30000,
    category: 'coffee',
    description: 'Double shot espresso ristretto disajikan dengan susu hangat berbusa sangat halus (microfoam).',
    image: 'https://images.unsplash.com/photo-1577968897066-11440ef71e4f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c7',
    name: 'Piccolo',
    price: 28000,
    category: 'coffee',
    description: 'Mini latte bergaya Australia dengan ristretto shot pekat dan sedikit susu hangat berbusa halus.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'c8',
    name: 'Caramel Macchiato',
    price: 35000,
    category: 'coffee',
    description: 'Perpaduan sirup vanila manis, susu segar, espresso shot, dan siraman saus karamel di atasnya.',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 35000 },
      { name: 'Dingin', price: 37000 }
    ]
  },
  {
    id: 'c9',
    name: 'Vanilla Latte',
    price: 33000,
    category: 'coffee',
    description: 'Espresso khas kami dicampur dengan steamed milk lembut dan ekstrak vanila manis harum menenangkan.',
    image: 'https://images.unsplash.com/photo-1595434066389-0cf5da759656?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 33000 },
      { name: 'Dingin', price: 35000 }
    ]
  },
  {
    id: 'c10',
    name: 'Hazelnut Latte',
    price: 33000,
    category: 'coffee',
    description: 'Espresso nikmat berpadu dengan susu hangat dan rasa manis kacang hazelnut panggang aromatik.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 33000 },
      { name: 'Dingin', price: 35000 }
    ]
  },
  {
    id: 'c11',
    name: 'Mochaccino',
    price: 35000,
    category: 'coffee',
    description: 'Paduan sempurna espresso pekat, cokelat premium cair, dan susu hangat yang gurih manis.',
    image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 35000 },
      { name: 'Dingin', price: 37000 }
    ]
  },
  {
    id: 'c12',
    name: 'Affogato',
    price: 28000,
    category: 'coffee',
    description: 'Satu scoop es krim vanila manis lembut yang disiram langsung dengan espresso shot panas pekat.',
    image: 'https://images.unsplash.com/photo-1594911774802-8822a707c93e?q=80&w=600&auto=format&fit=crop'
  },

  // NON-COFFEE SELECTION
  {
    id: 'nc1',
    name: 'Matcha Latte',
    price: 30000,
    category: 'non-coffee',
    description: 'Teh matcha Jepang ceremonial grade premium pilihan yang diaduk dengan susu murni segar dan sirup.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 30000 },
      { name: 'Dingin', price: 32000 }
    ]
  },
  {
    id: 'nc2',
    name: 'Chocolate',
    price: 30000,
    category: 'non-coffee',
    description: 'Minuman cokelat hitam premium pekat kaya rasa yang disajikan hangat atau dingin dengan susu murni.',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 30000 },
      { name: 'Dingin', price: 32000 }
    ]
  },
  {
    id: 'nc3',
    name: 'Taro Latte',
    price: 28000,
    category: 'non-coffee',
    description: 'Minuman taro talas ungu manis nan gurih legit berpadu susu murni segar berkrim.',
    image: 'https://images.unsplash.com/photo-1616157434524-2c256086f6de?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 28000 },
      { name: 'Dingin', price: 30000 }
    ]
  },
  {
    id: 'nc4',
    name: 'Red Velvet',
    price: 28000,
    category: 'non-coffee',
    description: 'Rasa kue red velvet manis gurih berpadu dengan susu murni segar yang lembut dan lezat.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 28000 },
      { name: 'Dingin', price: 30000 }
    ]
  },
  {
    id: 'nc5',
    name: 'Charcoal Latte',
    price: 30000,
    category: 'non-coffee',
    description: 'Minuman unik dengan kandungan karbon bambu aktif berkualitas tinggi dengan susu segar manis.',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 30000 },
      { name: 'Dingin', price: 32000 }
    ]
  },
  {
    id: 'nc6',
    name: 'Thai Tea (Iced)',
    price: 22000,
    category: 'non-coffee',
    description: 'Teh hitam beraroma rempah khas Thailand dipadukan kental manis and susu segar dingin.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nc7',
    name: 'Lychee Tea (Iced)',
    price: 25000,
    category: 'non-coffee',
    description: 'Teh melati dingin dipadukan buah leci manis asli dan sirup leci segar yang disukai semua kalangan.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nc8',
    name: 'Peach Tea (Iced)',
    price: 25000,
    category: 'non-coffee',
    description: 'Teh hitam dingin menyegarkan dengan rasa buah persik manis aromatik segar.',
    image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'nc9',
    name: 'Lemon Tea',
    price: 22000,
    category: 'non-coffee',
    description: 'Teh hitam klasik diseduh hangat atau dingin dipadukan dengan perasan lemon asli asam segar.',
    image: 'https://images.unsplash.com/photo-1515467389143-652f416d7a46?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 22000 },
      { name: 'Dingin', price: 24000 }
    ]
  },
  {
    id: 'nc10',
    name: 'Regular Tea',
    price: 15000,
    category: 'non-coffee',
    description: 'Seduhan teh melati tradisional pilihan aromatik menenangkan disajikan manis atau tawar.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop',
    variants: [
      { name: 'Panas', price: 15000 },
      { name: 'Dingin', price: 17000 }
    ]
  },

  // MAIN COURSE
  {
    id: 'mc1',
    name: 'Nasi Goreng Kampung',
    price: 35000,
    category: 'main-course',
    description: 'Nasi goreng bumbu tradisional Jawa dengan suwiran ayam, telor ceplok, kerupuk, dan acar segar.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc2',
    name: 'Nasi Goreng Seafood',
    price: 40000,
    category: 'main-course',
    description: 'Nasi goreng spesial dengan isian udang segar empuk, cumi, bakso ikan, telur, dan kerupuk udang.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc3',
    name: 'Nasi Goreng Gila',
    price: 38000,
    category: 'main-course',
    description: 'Nasi goreng dengan topping melimpah orak-arik bakso sapi, sosis, ayam bumbu pedas manis gurih.',
    image: 'https://images.unsplash.com/photo-1603133872878-6967b68270c6?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc4',
    name: 'Mie Goreng Jawa',
    price: 32000,
    category: 'main-course',
    description: 'Mie telur kenyal digoreng bumbu Jawa manis gurih sedikit pedas dengan sayuran dan suwiran ayam.',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc5',
    name: 'Mie Rebus Jawa',
    price: 32000,
    category: 'main-course',
    description: 'Mie telur disajikan kuah kaldu kental gurih hangat dengan telur bebek hancur, ayam, dan kol segar.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc6',
    name: 'Kwetiau Goreng (Ayam/Sapi)',
    price: 35000,
    category: 'main-course',
    description: 'Kwetiau beras pipih digoreng kecap manis gurih dengan pilihan suwiran ayam atau potongan daging sapi.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc7',
    name: 'Ayam Goreng Mentega + Nasi',
    price: 42000,
    category: 'main-course',
    description: 'Daging ayam goreng garing disiram saus mentega kecap inggris kental manis gurih disajikan + nasi hangat.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc8',
    name: 'Ayam Geprek Sambal Matah + Nasi',
    price: 35000,
    category: 'main-course',
    description: 'Ayam krispi garing gurih digeprek pedas disajikan dengan siraman sambal matah Bali segar + nasi.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc9',
    name: 'Chicken Katsu Curry Rice',
    price: 45000,
    category: 'main-course',
    description: 'Ayam katsu krispi dibalur tepung panir disajikan dengan nasi hangat dan siraman kuah kari Jepang kental harum.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc10',
    name: 'Beef Teriyaki Rice Bowl',
    price: 48000,
    category: 'main-course',
    description: 'Irisan daging sapi US tenderloin empuk ditumis bumbu teriyaki manis gurih di atas mangkuk nasi hangat.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc11',
    name: 'Spaghetti Bolognese',
    price: 38000,
    category: 'main-course',
    description: 'PAsta spaghetti al dente disiram saus marinara tomat daging sapi cincang manis gurih melimpah.',
    image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc12',
    name: 'Spaghetti Carbonara',
    price: 42000,
    category: 'main-course',
    description: 'PAsta spaghetti creamy saus susu krim keju gurih dengan taburan irisan smoked beef krispi wangi.',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'mc13',
    name: 'Spaghetti Aglio Olio',
    price: 35000,
    category: 'main-course',
    description: 'PAsta spaghetti ditumis bawang putih wangi, minyak zaitun, potongan cabai rawit pedas, dan ayam.',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=600&auto=format&fit=crop'
  },

  // SNACKS & LIGHT MEALS
  {
    id: 's1',
    name: 'French Fries',
    price: 20000,
    category: 'snack',
    description: 'Kentang goreng impor potongan lurus bertabur garam gurih renyah hangat, disajikan dengan saus sambal.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's2',
    name: 'Potato Wedges',
    price: 22000,
    category: 'snack',
    description: 'Potongan kentang tebal berkulit dibumbui rempah asin gurih wangi bawang lalu digoreng garing.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's3',
    name: 'Cireng Rujak',
    price: 18000,
    category: 'snack',
    description: 'Camilan aci goreng garing kenyal hangat disajikan dengan cocolan saus rujak asam pedas manis segar.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's4',
    name: 'Tahu Cabe Garam',
    price: 22000,
    category: 'snack',
    description: 'Tahu sutra krispi dipotong kotak ditumis bumbu bawang putih wangi garing dan cabai pedas asin gurih.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's5',
    name: 'Singkong Goreng Keju',
    price: 20000,
    category: 'snack',
    description: 'Singkong goreng mekar empuk renyah bertabur keju cheddar parut melimpah di atasnya.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's6',
    name: 'Pisang Goreng Cokelat Keju',
    price: 22000,
    category: 'snack',
    description: 'Pisang kepok goreng krispi manis bertabur meses cokelat manis dan parutan keju gurih melimpah.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's7',
    name: 'Chicken Wings (6 pcs)',
    price: 32000,
    category: 'snack',
    description: 'Sayap ayam goreng garing krispi dibaluri saus BBQ pedas manis gurih lezat isi 6 buah.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's8',
    name: 'Calamari Rings',
    price: 30000,
    category: 'snack',
    description: 'Cumi cincin dibalur tepung panir krispi digoreng garing disajikan dengan saus tartar cocolan.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's9',
    name: 'Platter Mix (Fries, Sausage, Nugget)',
    price: 38000,
    category: 'snack',
    description: 'Kombinasi kentang goreng renyah, sosis sapi bakar gurih, dan nugget ayam krispi hangat.',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's10',
    name: 'Roti Bakar Cokelat Keju',
    price: 22000,
    category: 'snack',
    description: 'Roti tawar tebal bakar isi cokelat meses manis legit bertabur keju parut gurih melimpah.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 's11',
    name: 'Roti Bakar Kaya Butter',
    price: 20000,
    category: 'snack',
    description: 'Roti bakar garing wangi dioles mentega premium asin dan selai srikaya manis harum tradisional.',
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop'
  },

  // MOCKTAILS & REFRESHERS
  {
    id: 'r1',
    name: 'Virgin Mojito',
    price: 28000,
    category: 'refresher',
    description: 'Minuman dingin menyegarkan campuran perasan jeruk nipis asam, daun mint remuk, gula, dan soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r2',
    name: 'Lychee Mojito',
    price: 30000,
    category: 'refresher',
    description: 'Campuran jeruk nipis, daun mint segar, buah leci manis asli, sirup, dan air soda dingin menyegarkan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r3',
    name: 'Strawberry Mojito',
    price: 30000,
    category: 'refresher',
    description: 'Sensasi asam manis dari buah strawberry segar hancur, mint harum, perasan jeruk nipis, dan air soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r4',
    name: 'Blue Ocean Soda',
    price: 28000,
    category: 'refresher',
    description: 'Minuman soda biru segar dengan sirup jeruk curacao biru, leci manis, biji selasih, dan jeruk nipis.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r5',
    name: 'Mango Sunrise',
    price: 28000,
    category: 'refresher',
    description: 'Perpaduan sirup mangga manis harum, jus jeruk segar dingin, dan siraman sirup grenadine merah cantik.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r6',
    name: 'Kiwi Blast',
    price: 30000,
    category: 'refresher',
    description: 'Minuman penyegar rasa buah kiwi asam manis segar dipadukan dengan daun mint remuk dan soda dingin.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'r7',
    name: 'Lemonade Cold Brew',
    price: 32000,
    category: 'refresher',
    description: 'Perpaduan kopi cold brew khas kami dengan air jeruk lemon asam manis dingin yang mengejutkan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop'
  }
];
