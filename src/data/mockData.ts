import { 
  MenuItem, 
  StoreLocation, 
  ComboDeal, 
  PromoCoupon, 
  WeeklySubscriptionPlan, 
  ToppingOption,
  PlacedOrder,
  CustomerRecord
} from '../types';

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'akl-cbd',
    name: 'Auckland CBD Express',
    suburb: 'Auckland Central',
    city: 'Auckland',
    address: '218 Queen Street, Auckland Central, Auckland 1010',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'cbd@tiffintreat.co.nz',
    hours: '11:00 AM – 10:30 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '30 - 45 mins',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -36.8485, lng: 174.7633 }
  },
  {
    id: 'ponsonby',
    name: 'Ponsonby Artisan Hub',
    suburb: 'Ponsonby',
    city: 'Auckland',
    address: '142 Ponsonby Road, Ponsonby, Auckland 1011',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'ponsonby@tiffintreat.co.nz',
    hours: '11:30 AM – 11:00 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '25 - 40 mins',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -36.8582, lng: 174.7460 }
  },
  {
    id: 'takapuna',
    name: 'Takapuna Beachside',
    suburb: 'Takapuna',
    city: 'Auckland',
    address: '48 Hurstmere Road, Takapuna, North Shore 0622',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'takapuna@tiffintreat.co.nz',
    hours: '11:00 AM – 10:00 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '30 - 40 mins',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -36.7891, lng: 174.7738 }
  },
  {
    id: 'albany',
    name: 'Albany Village & Campus',
    suburb: 'Albany',
    city: 'Auckland',
    address: '219 Don McKinnon Drive, Albany, Auckland 0632',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'albany@tiffintreat.co.nz',
    hours: '11:00 AM – 10:00 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '35 - 45 mins',
    deliveryFee: 5.49,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -36.7314, lng: 174.7088 }
  },
  {
    id: 'manukau',
    name: 'Manukau City Centre',
    suburb: 'Manukau',
    city: 'Auckland',
    address: '652 Great South Road, Manukau, Auckland 2104',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'manukau@tiffintreat.co.nz',
    hours: '11:00 AM – 11:00 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '30 - 45 mins',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -36.9926, lng: 174.8778 }
  },
  {
    id: 'chch-central',
    name: 'Christchurch Oxford Hub',
    suburb: 'Christchurch Central',
    city: 'Christchurch',
    address: '182 Oxford Terrace, Christchurch Central 8011',
    phone: '0212779279',
    secondaryPhone: '0277479279',
    email: 'chch@tiffintreat.co.nz',
    hours: '11:30 AM – 10:00 PM Daily',
    pickupTime: '15 - 20 mins',
    deliveryTime: '30 - 45 mins',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isOpen: true,
    coords: { lat: -43.5321, lng: 172.6362 }
  }
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'ex-butter', name: 'Extra Pure Desi Butter / Makhan', price: 1.50, category: 'cheese' },
  { id: 'paneer-add', name: 'Extra Sautéed Spiced Paneer', price: 3.50, category: 'cheese' },
  { id: 'extra-chole', name: 'Bowl of Punjabi Chana Masala', price: 4.50, category: 'sauce' },
  { id: 'pickled-onions', name: 'Lachha Pickled Onions & Green Chillies', price: 1.50, category: 'veg' },
  { id: 'mint-chutney-cup', name: 'Extra Mint-Coriander Chutney Cup', price: 1.50, category: 'sauce' },
  { id: 'tamarind-chutney-cup', name: 'Extra Sweet Tamarind Saunth Cup', price: 1.50, category: 'sauce' }
];

export const MENU_ITEMS: MenuItem[] = [
  // ============================================================================
  // 1. PARATHA
  // ============================================================================
  {
    id: 'paratha-allo',
    name: 'Allo Paratha',
    tagline: 'Classic spiced mashed potato stuffed paratha',
    category: 'paratha',
    description: 'Golden-crisped wholewheat flatbread generously filled with spiced mashed potatoes, fresh green coriander, roasted cumin, and green chillies. Served with fresh butter.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '420 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-mooli',
    name: 'Mooli Paratha',
    tagline: 'Spiced grated white radish stuffed paratha',
    category: 'paratha',
    description: 'Traditional Punjabi paratha stuffed with freshly grated white radish, crushed carom seeds (ajwain), ginger, and herbs, tawa-roasted to crisp perfection.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    calories: '380 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-gobi',
    name: 'Gobi Paratha',
    tagline: 'Finely grated cauliflower & warm spices',
    category: 'paratha',
    description: 'Homestyle wholewheat paratha stuffed with spiced cauliflower florets, turmeric, garam masala, and fresh coriander, cooked with golden desi butter.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    calories: '390 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-paneer',
    name: 'Paneer Paratha',
    tagline: 'Hand-crumbled fresh cottage cheese & herbs',
    category: 'paratha',
    description: 'Rich wholewheat flatbread stuffed with seasoned crumbled fresh paneer, finely diced onions, green chillies, and roasted kasuri methi.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isChefSpecial: true,
    calories: '490 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-mix',
    name: 'Mix Paratha',
    tagline: 'Wholesome blend of aloo, gobi & paneer',
    category: 'paratha',
    description: 'The best of all fillings: spiced potatoes, cauliflower, and crumbled paneer seasoned with royal spices inside a crisp tawa-roasted paratha.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '460 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-daal-missa',
    name: 'Daal/Missa Paratha',
    tagline: 'Spiced gram flour & lentil rustic flatbread',
    category: 'paratha',
    description: 'Authentic Missi / Daal paratha crafted from seasoned chickpea gram flour and lentils, crushed coriander, pomegranate seeds, and onions.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    calories: '280 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'paratha-ajwain',
    name: 'Ajwain Paratha',
    tagline: 'Flaky layered paratha with aromatic carom seeds',
    category: 'paratha',
    description: 'Multi-layered flaky triangular paratha infused with fragrant digestive ajwain seeds and pure desi ghee, pan-toasted until crispy and golden.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
    calories: '290 kcal',
    serves: '1 Person',
    customizable: true
  },
  {
    id: 'paratha-namak',
    name: 'Namak Paratha',
    tagline: 'Crispy salted layered wholewheat flatbread',
    category: 'paratha',
    description: 'Traditional simple layered paratha seasoned with sea salt and brushed with pure butter, an essential companion to tiffins and hot chai.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    calories: '270 kcal',
    serves: '1 Person',
    customizable: true
  },

  // ============================================================================
  // 2. CHAT & SNACKS
  // ============================================================================
  {
    id: 'chat-dahi-bhalla',
    name: 'Dahi Bhalla',
    tagline: 'Soft lentil dumplings in sweet chilled curd with chutneys',
    category: 'chat',
    description: 'Pillowy soft lentil dumplings immersed in velvety chilled sweetened yogurt, garnished with tangy tamarind dates chutney, spicy mint chutney, and roasted cumin.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '360 kcal',
    serves: '1-2 People'
  },
  {
    id: 'chat-papdi-chat',
    name: 'Papdi Chat',
    tagline: 'Crisp flour crackers with potatoes, yogurt & chutneys',
    category: 'chat',
    description: 'Crispy round papdis topped with boiled spiced potatoes, chickpeas, sweet yogurt, saunth chutney, zesty green chutney, and fine nylon sev.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '380 kcal',
    serves: '1-2 People'
  },
  {
    id: 'chat-dahi-puri',
    name: 'Dahi Puri',
    tagline: 'Puffed crispy puris filled with potatoes & chilled sweet dahi',
    category: 'chat',
    description: 'Crisp puris stuffed with potato mash and chickpeas, drowned in sweet chilled yogurt, tamarind sauce, mint dip, and crunchy sev.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '350 kcal',
    serves: '1-2 People'
  },
  {
    id: 'chat-allo-tikki-chat',
    name: 'Allo Tikki Chat',
    tagline: 'Pan-crisped potato cutlets with hot chole & chutneys',
    category: 'chat',
    description: 'Two golden potato tikkis served sizzling hot with spicy chickpea curry, whipped spiced curd, tamarind chutney, mint sauce, and fresh coriander.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isChefSpecial: true,
    calories: '440 kcal',
    serves: '1-2 People'
  },
  {
    id: 'chat-dahi-bhalla-papdi-chaat',
    name: 'Dahi Bhalla Papdi Chaat',
    tagline: 'Royal street platter combining soft bhallas & crispy papdis',
    category: 'chat',
    description: 'The ultimate chaat combo: melt-in-mouth lentil bhallas layered with crunchy papdi wafers, drenched in chilled sweet curd and dual artisanal chutneys.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '460 kcal',
    serves: '1-2 People'
  },
  {
    id: 'chat-bread-pokoda',
    name: 'Bread Pokoda',
    tagline: 'Spiced potato stuffed batter-fried street bread fritter',
    category: 'chat',
    description: 'Crispy triangular bread fritters filled with seasoned mashed potatoes, dipped in spiced chickpea batter and deep-fried to golden perfection. Served with chutney.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    calories: '280 kcal',
    serves: '1 Person'
  },

  // ============================================================================
  // 3. ROLLS
  // ============================================================================
  {
    id: 'rolls-paneer-roll',
    name: 'Paneer Roll',
    tagline: 'Charred spiced cottage cheese cubes wrapped in warm paratha',
    category: 'rolls',
    description: 'Tender paneer cubes wok-tossed with tandoori spices, crunchy bell peppers, and sliced onions, rolled inside a flaky handmade paratha with house mint sauce.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '520 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },

  // ============================================================================
  // 4. KULCHA
  // ============================================================================
  {
    id: 'kulcha-stuffed',
    name: 'Stuffed Kulcha',
    tagline: 'Clay-oven crisped Amritsari stuffed kulcha with butter',
    category: 'kulcha',
    description: 'Traditional leavened flatbread stuffed with spiced potato and onion filling, baked in tandoor until crisp and glazed with rich butter.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '450 kcal',
    serves: '1 Person'
  },
  {
    id: 'kulcha-allo-tikki',
    name: 'Allo Tikki Kulcha',
    tagline: 'Crisp potato patty sandwiched inside butter-toasted kulcha',
    category: 'kulcha',
    description: 'Golden spiced aloo cutlet pressed into a warm buttered kulcha with mint sauce, tamarind chutney, and sliced onions.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '490 kcal',
    serves: '1 Person'
  },
  {
    id: 'kulcha-paneer',
    name: 'Paneer Kulcha',
    tagline: 'Loaded with seasoned crumbled paneer & roasted herbs',
    category: 'kulcha',
    description: 'Crispy layered Amritsari kulcha generously packed with freshly grated cottage cheese, roasted coriander, green chillies, and melted butter.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '550 kcal',
    serves: '1 Person'
  },
  {
    id: 'kulcha-nutri',
    name: 'Nutri Kulcha',
    tagline: 'Protein-rich soya nutri chunks in spicy gravy with soft kulchas',
    category: 'kulcha',
    description: 'Legendary Amritsari street dish: high-protein soya chunks simmered in a dark, robust onion-tomato masala, served with 2 warm buttered kulchas.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isChefSpecial: true,
    calories: '580 kcal',
    serves: '1-2 People'
  },
  {
    id: 'kulcha-bheeja',
    name: 'Bheeja Kulcha',
    tagline: 'Kulchas soaked in rich tangy Punjabi chana gravy',
    category: 'kulcha',
    description: 'Amritsari specialty: soft kulchas fully submerged and soaked in aromatic spicy chole gravy, garnished with chopped onions, green chillies, and lemon juice.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '540 kcal',
    serves: '1-2 People'
  },

  // ============================================================================
  // 5. BURGERS & SANDWICHES
  // ============================================================================
  {
    id: 'burger-noodle',
    name: 'Noodle Burger',
    tagline: 'Wok-tossed spicy hakka noodles in a toasted burger bun',
    category: 'burgers',
    description: 'Desi street fusion burger stuffed with spicy stir-fried noodles, schezwan sauce, crisp lettuce, and onion rings inside a toasted bun.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '510 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'burger-paneer',
    name: 'Paneer Burger',
    tagline: 'Grilled spiced cottage cheese slab with tandoori mayo',
    category: 'burgers',
    description: 'Thick marinated fresh paneer patty grilled golden, layered with cheese, fresh tomatoes, crunchy cucumber, and house special tandoori sauce.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '560 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'burger-paneer-noodle',
    name: 'Paneer Noodle Burger',
    tagline: 'Colossal double stack: paneer patty & spicy wok noodles',
    category: 'burgers',
    description: 'The ultimate loaded street burger featuring a crispy spiced paneer slab topped with stir-fried hakka noodles, cheese, and spicy aioli.',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '640 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Kiwi Hot'
  },
  {
    id: 'burger-aloo-tikki',
    name: 'Aloo Tikki Burger',
    tagline: 'Crispy spiced potato cutlet with mint mayo & fresh salad',
    category: 'burgers',
    description: 'Golden-fried spiced potato and garden pea patty topped with crunchy shredded lettuce, sliced onions, tomatoes, and tangy mint mayo.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    calories: '450 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'burger-tnt-special',
    name: 'TNT Special Burger',
    tagline: 'House signature double-decker loaded powerhouse burger',
    category: 'burgers',
    description: 'Chef’s monster creation: double patties, molten cheese, seasoned grilled paneer, caramelized onions, and secret TNT special glaze.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isChefSpecial: true,
    calories: '720 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Kiwi Hot'
  },
  {
    id: 'sandwich-tandoori',
    name: 'Tandoori Sandwich',
    tagline: 'Triple-decker toasted sandwich with smoky tandoori filling',
    category: 'burgers',
    description: 'Crispy golden-toasted bread layered with smoky spiced vegetables, paneer, melted mozzarella, and tangy mint chutney.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
    calories: '480 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'sandwich-paneer-burji',
    name: 'Paneer Burji Sandwich',
    tagline: 'Spiced scrambled cottage cheese toasted crunch sandwich',
    category: 'burgers',
    description: 'Artisanal bread generously stuffed with wok-tossed spiced scrambled paneer bhurji, bell peppers, melted butter, and grilled until crunchy.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '530 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },

  // ============================================================================
  // 6. MAGGI, TEA & CHA-CHURI
  // ============================================================================
  {
    id: 'maggi-indian-veg',
    name: 'Indian Style Veg Maggi',
    tagline: 'Piping hot street-style noodles with peas, carrots & spices',
    category: 'maggi',
    description: 'Classic 2-minute comfort noodles prepared street-style with sautéed onions, tomatoes, sweet garden peas, carrots, and extra Maggi masala.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '390 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'maggi-masala-tea',
    name: 'Masala Tea',
    tagline: 'Aromatic ginger & cardamom slow-brewed milk chai',
    category: 'maggi',
    description: 'Freshly boiled authentic karak chai infused with crushed ginger, green cardamom pods, cinnamon bark, and whole milk.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '120 kcal',
    serves: '1 Cup'
  },
  {
    id: 'maggi-cha-churi',
    name: 'Cha-Churi',
    tagline: 'Desi ghee sweet crumbled churi paired with hot masala tea',
    category: 'maggi',
    description: 'Authentic Punjabi heritage soul food: hot fresh rotis hand-crushed with pure desi ghee and shakkar (raw jaggery), served with steaming masala tea.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '560 kcal',
    serves: '1 Person'
  },

  // ============================================================================
  // 7. FRIES
  // ============================================================================
  {
    id: 'fries-loaded',
    name: 'Loaded Fries',
    tagline: 'Crispy skin-on fries with melted cheese sauce & jalapenos',
    category: 'fries',
    description: 'Generous platter of golden-fried potatoes topped with warm cheddar cheese sauce, peri-peri seasoning, diced pickled jalapeños, and spiced aioli.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '540 kcal',
    serves: '1-2 People'
  },
  {
    id: 'fries-salted',
    name: 'Salted Fries',
    tagline: 'Golden crispy potato fries seasoned with sea salt',
    category: 'fries',
    description: 'Piping hot and crispy shoestring potato fries lightly dusted with fine sea salt. Served with dipping sauce.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    calories: '320 kcal',
    serves: '1 Person'
  },
  {
    id: 'fries-cheesy',
    name: 'Cheesy Fries',
    tagline: 'Crispy golden fries coated in rich melted cheese',
    category: 'fries',
    description: 'Crispy fries smothered in velvety melted cheddar cheese drizzle and herbs.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    calories: '420 kcal',
    serves: '1 Person'
  },

  // ============================================================================
  // 8. RICE
  // ============================================================================
  {
    id: 'rice-jeera',
    name: 'Jeera Rice',
    tagline: 'Steamed basmati rice tempered with roasted cumin & ghee',
    category: 'rice',
    description: 'Fluffy long-grain basmati rice tempered with toasted cumin seeds and pure desi ghee, garnished with fresh chopped coriander.',
    price: 2.99,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    calories: '260 kcal',
    serves: '1 Person'
  },
  {
    id: 'rice-fried-mix-veg',
    name: 'Fried Mix Veg Rice',
    tagline: 'Wok-tossed basmati rice with diced vegetables & light seasoning',
    category: 'rice',
    description: 'Fragrant basmati rice stir-fried in a high-flame wok with carrots, green beans, peas, bell peppers, spring onions, and light soya sauce.',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '480 kcal',
    serves: '1-2 People'
  },

  // ============================================================================
  // 9. BEVERAGES
  // ============================================================================
  {
    id: 'beverage-masala-tea',
    name: 'Masala Tea',
    tagline: 'Traditional Indian spiced tea brewed with ginger & cardamom',
    category: 'drinks',
    description: 'Hot authentic karak chai simmered with fresh ginger, cracked cardamom, and creamy whole milk.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '120 kcal',
    serves: '1 Cup'
  },
  {
    id: 'beverage-soft-drinks',
    name: 'Soft Drinks',
    tagline: 'Chilled canned drink (330ml Can)',
    category: 'drinks',
    description: 'Choice of chilled refreshing soft drinks: Coke, Coke No Sugar, Sprite, Fanta, L&P, or Ginger Beer.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1581098365948-6a5a912b7a49?auto=format&fit=crop&w=800&q=80',
    calories: '140 kcal',
    serves: '1 Can (330ml)'
  },

  // ============================================================================
  // 10. TIFFIN (MEALS)
  // ============================================================================
  {
    id: 'tiffin-regular',
    name: 'Regular Tiffin',
    tagline: 'Full tiffin tray: regular curry, 4 rotis & steamed rice',
    category: 'tiffins',
    description: 'Wholesome full-size tiffin meal tray including 1 homestyle curry of the day, 4 hot handmade butter rotis, steamed basmati rice, and fresh pickle/salad.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '680 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['4 Hot Butter Rotis', 'Regular Curry of the Day', 'Steamed Basmati Rice', 'Pickle & Salad']
  },
  {
    id: 'tiffin-half-half-portion',
    name: 'Half Half Portion Tiffin',
    tagline: 'Dual-portion tiffin with 2 different curries & sides',
    category: 'tiffins',
    description: 'Enjoy the best of both worlds! Includes 2 separate half-portions of daily curries (e.g. Daal + Sabzi or Paneer), served with 4 hot rotis, basmati rice, and sides.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isChefSpecial: true,
    calories: '720 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['4 Hot Butter Rotis', 'Two Half-Half Curries', 'Basmati Rice', 'Kachumber Salad']
  },
  {
    id: 'tiffin-special',
    name: 'Special Tiffin',
    tagline: 'Grand royal tiffin feast with special curry, sides & sweet',
    category: 'tiffins',
    description: 'Our richest chef’s special tiffin tray featuring a premium curry (e.g. Sahi Paneer / Paneer Burji / Baingan Bharta), 4 hot rotis, fragrant jeera rice, dahi/raita, and sweet treat.',
    price: 17.00,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '790 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['4 Hot Butter Rotis', 'Special Royal Curry', 'Jeera Basmati Rice', 'Dahi/Raita & Sweet']
  },
  {
    id: 'tiffin-small-regular',
    name: 'Small Regular Tiffin',
    tagline: 'Compact regular tiffin meal with 3 rotis & curry',
    category: 'tiffins',
    description: 'Perfect single portion comfort lunch: 1 homestyle regular curry of the day, 3 fresh handmade rotis or steamed basmati rice, and pickle.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    calories: '560 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Rotis', 'Regular Daily Curry', 'Basmati Rice', 'Spiced Pickle']
  },
  {
    id: 'tiffin-small-special',
    name: 'Small Special Tiffin',
    tagline: 'Compact special tiffin with premium royal curry',
    category: 'tiffins',
    description: 'Generous single portion special tiffin featuring our premium speciality curry (e.g. Sahi Paneer or Paneer Burji), served with 3 hot butter rotis and basmati rice.',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    isChefSpecial: true,
    calories: '640 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis', 'Speciality Curry', 'Basmati Rice', 'Pickle']
  },

  // ============================================================================
  // 11. TIFFIN EXTRAS
  // ============================================================================
  {
    id: 'extra-rice',
    name: 'Rice',
    tagline: 'Extra portion of steamed fragrant basmati rice',
    category: 'tiffin_extras',
    description: 'Freshly steamed warm long-grain basmati rice portion to accompany your meal.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    calories: '240 kcal',
    serves: '1 Portion'
  },
  {
    id: 'extra-roti',
    name: 'Extra Roti',
    tagline: 'Fresh handmade hot butter roti',
    category: 'tiffin_extras',
    description: '1 piece freshly puffed handmade wholewheat tawa roti brushed with golden butter.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    calories: '110 kcal',
    serves: '1 Roti'
  },
  {
    id: 'extra-dahi',
    name: 'Dahi',
    tagline: 'Fresh set whole milk plain curd',
    category: 'tiffin_extras',
    description: 'A bowl of cool, fresh homemade set curd (dahi) to balance spices.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    calories: '130 kcal',
    serves: '1 Bowl'
  },
  {
    id: 'extra-raita',
    name: 'Raita',
    tagline: 'Chilled spiced cucumber & boondi raita',
    category: 'tiffin_extras',
    description: 'Whipped curd seasoned with roasted ground cumin, black salt, diced cucumber, and crisp boondi pearls.',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    calories: '140 kcal',
    serves: '1 Bowl'
  },
  {
    id: 'extra-chutney',
    name: 'Extra Chutney',
    tagline: 'Choice of tangy tamarind or spicy mint chutney',
    category: 'tiffin_extras',
    description: 'Extra dip cup of our signature sweet tamarind saunth or refreshing spicy mint-coriander chutney.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    calories: '45 kcal',
    serves: '1 Pot'
  }
];

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 'combo-allo-paratha',
    title: 'Allo Paratha Combo',
    badge: 'TNT SIGNATURE COMBO',
    tagline: 'Allo Paratha + Curd + Pickle + Lassi or Tea',
    price: 20.00,
    originalPrice: 24.50,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    serves: '1 Person',
    itemsIncluded: [
      '1x Freshly Made Hot Allo Paratha with Butter',
      '1x Bowl of Fresh Set Homemade Curd (Dahi)',
      '1x Tangy Spiced Mango & Chilli Pickle (Achar)',
      '1x Chilled Sweet/Mango Lassi or Piping Hot Masala Tea'
    ],
    description: 'The iconic TNT Special Combo featured directly on our menu board: A piping-hot, crispy Allo Paratha served with cool curd, punchy pickle, and your choice of chilled lassi or freshly brewed Masala Karak Chai.'
  }
];

export const PROMO_COUPONS: PromoCoupon[] = [
  {
    code: 'WELCOME15',
    description: '15% off your first order on tiffintreat.co.nz',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 20
  },
  {
    code: 'TIFFIN5',
    description: '$5.00 off on any order over $30',
    discountType: 'fixed',
    discountValue: 5.00,
    minOrder: 30
  },
  {
    code: 'FEAST20',
    description: '20% off on family orders over $50',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 50
  }
];

export const WEEKLY_SUBSCRIPTION_PLANS: WeeklySubscriptionPlan[] = [
  {
    id: 'sub-5-day-lunch',
    title: '5-Day Daily Tiffin Pass',
    mealsPerWeek: 5,
    pricePerMeal: 12.00,
    weeklyTotal: 60.00,
    badge: 'MOST POPULAR',
    description: 'Hot authentic homestyle tiffins (Regular / Special rotation with 4 rotis, curry & rice) delivered fresh Monday to Friday.',
    features: [
      'Authentic daily rotating menu straight from our kitchen',
      'Includes 4 hot butter rotis, daily curry, steamed basmati rice & pickle',
      'Pause, skip days or cancel anytime via portal',
      'Zero delivery fee for Auckland & Christchurch central areas'
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-7-day-dinner',
    title: '7-Day Complete Tiffin Plan (Mon - Sun)',
    mealsPerWeek: 7,
    pricePerMeal: 12.00,
    weeklyTotal: 84.00,
    badge: 'FULL WEEK PASS',
    description: 'Enjoy a complete week of delicious home-cooked meals including weekend Half-Half portion and Special Tiffin feasts.',
    features: [
      'Complete 7-day culinary variety without cooking or dishwashing',
      'Includes Half-Half and Special Tiffin upgrades',
      'Free cup of Masala Tea included every weekend',
      'Eco-friendly thermal insulated tiffins'
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-student-flex',
    title: 'Small Regular Tiffin 5-Day Pass',
    mealsPerWeek: 5,
    pricePerMeal: 10.00,
    weeklyTotal: 50.00,
    description: 'Compact comfort tiffins with 3 rotis & fresh curry. Perfect for students and light lunches.',
    features: [
      'Wholesome comfort lunch with 3 hot rotis & daily curry',
      'Mon to Fri scheduled delivery',
      'Free cup of Masala Chai with every tiffin'
    ],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80'
  }
];

export const NZ_SUBURBS_LIST = [
  'Auckland CBD', 'Ponsonby', 'Grey Lynn', 'Mount Eden', 'Newmarket', 
  'Parnell', 'Takapuna', 'Devonport', 'Albany', 'Northcote',
  'Birkenhead', 'Henderson', 'New Lynn', 'Manukau', 'Papatoetoe',
  'Botany Downs', 'Pakuranga', 'Mount Albert', 'Kingsland', 'Remuera',
  'Christchurch Central', 'Riccarton', 'Merivale', 'Papanui', 'Addington'
];

export const INITIAL_ORDERS: PlacedOrder[] = [
  {
    orderId: 'ord-101',
    orderNumber: 'TT-892105',
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'Liam O’Connor',
      email: 'liam.oc@outlook.co.nz',
      phone: '021 553 9102',
      address: '210 Queen Street',
      apartmentUnit: 'Apt 12B',
      suburb: 'Auckland Central',
      city: 'Auckland',
      postcode: '1010',
      deliveryNotes: 'Meet at lobby buzzer 1202, please bring EFTPOS if cash.',
      orderMode: 'delivery',
      storeId: 'akl-cbd',
      deliveryTimeType: 'asap',
      paymentMethod: 'windcave_card',
      paymentGatewayDetails: {
        gateway: 'Windcave DPS NZ',
        receiptRef: 'WC-994182-NZ',
        authCode: 'AUTH-OK-9921'
      },
      tipAmount: 3.00,
      allergyNotice: 'Mild spice preferred please'
    },
    items: [
      {
        cartItemId: 'item-p1-1',
        menuItem: MENU_ITEMS[0], // Allo Paratha
        customization: {
          spiceLevel: 'Medium'
        },
        unitPrice: 7.99,
        quantity: 2,
        totalPrice: 15.98
      },
      {
        cartItemId: 'item-d1-2',
        menuItem: MENU_ITEMS[28], // Masala Tea
        unitPrice: 5.50,
        quantity: 2,
        totalPrice: 11.00
      }
    ],
    subtotal: 26.98,
    deliveryFee: 4.99,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 3.00,
    gstAmount: 3.91,
    totalAmount: 29.97,
    estimatedDeliveryTime: '25-35 mins',
    status: 'received',
    store: STORE_LOCATIONS[0]
  },
  {
    orderId: 'ord-102',
    orderNumber: 'TT-892104',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      phone: '021 884 9231',
      address: '142 Ponsonby Road',
      apartmentUnit: 'Apt 4B',
      suburb: 'Ponsonby',
      city: 'Auckland',
      postcode: '1011',
      deliveryNotes: 'Leave on porch table, please don’t ring doorbell.',
      orderMode: 'delivery',
      storeId: 'ponsonby',
      deliveryTimeType: 'asap',
      paymentMethod: 'online_eftpos',
      paymentGatewayDetails: {
        gateway: 'Online EFTPOS NZ (Worldline)',
        bankName: 'ANZ Bank New Zealand',
        authCode: 'ANZ-EFT-77192',
        receiptRef: 'OE-NZD-44102'
      },
      tipAmount: 3.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-k1-1',
        menuItem: MENU_ITEMS[17], // Paneer Kulcha
        customization: {
          spiceLevel: 'Medium'
        },
        unitPrice: 12.00,
        quantity: 2,
        totalPrice: 24.00
      },
      {
        cartItemId: 'item-c1-1',
        menuItem: MENU_ITEMS[8], // Dahi Bhalla
        unitPrice: 9.99,
        quantity: 1,
        totalPrice: 9.99
      }
    ],
    subtotal: 33.99,
    deliveryFee: 4.99,
    discount: 5.10,
    appliedCoupon: 'WELCOME15',
    tip: 3.00,
    gstAmount: 4.81,
    totalAmount: 36.88,
    estimatedDeliveryTime: '20-30 mins',
    status: 'kitchen',
    store: STORE_LOCATIONS[1]
  },
  {
    orderId: 'ord-103',
    orderNumber: 'TT-892102',
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'Priya Patel',
      email: 'priya.patel@nzhealth.org.nz',
      phone: '022 419 8832',
      address: '48 Hurstmere Road',
      apartmentUnit: 'Suite 2',
      suburb: 'Takapuna',
      city: 'Auckland',
      postcode: '0622',
      deliveryNotes: 'Pickup at counter by Priya',
      orderMode: 'pickup',
      storeId: 'takapuna',
      deliveryTimeType: 'asap',
      paymentMethod: 'poli_nz',
      paymentGatewayDetails: {
        gateway: 'POLi Internet Banking NZ',
        bankName: 'ASB Bank NZ',
        receiptRef: 'POLI-ASB-8831'
      },
      tipAmount: 2.00,
      allergyNotice: 'Strict vegetarian'
    },
    items: [
      {
        cartItemId: 'item-t1-1',
        menuItem: MENU_ITEMS[38], // Half Half Portion Tiffin
        customization: {
          spiceLevel: 'Kiwi Hot'
        },
        unitPrice: 14.00,
        quantity: 1,
        totalPrice: 14.00
      },
      {
        cartItemId: 'item-f1-1',
        menuItem: MENU_ITEMS[30], // Loaded Fries
        unitPrice: 9.99,
        quantity: 1,
        totalPrice: 9.99
      }
    ],
    subtotal: 23.99,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 2.00,
    gstAmount: 3.39,
    totalAmount: 25.99,
    estimatedDeliveryTime: '15 mins',
    status: 'packed',
    store: STORE_LOCATIONS[2]
  },
  {
    orderId: 'ord-104',
    orderNumber: 'TT-892101',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'Hone Morrison',
      email: 'hone.morrison@gmail.com',
      phone: '027 339 1204',
      address: '652 Great South Road',
      apartmentUnit: '',
      suburb: 'Manukau',
      city: 'Auckland',
      postcode: '2104',
      deliveryNotes: 'Leave in letterbox / porch',
      orderMode: 'delivery',
      storeId: 'manukau',
      deliveryTimeType: 'asap',
      paymentMethod: 'afterpay_nz',
      paymentGatewayDetails: {
        gateway: 'Afterpay NZ (4x Installments)',
        installmentAmount: 6.99,
        receiptRef: 'AP-NZ-660192'
      },
      tipAmount: 2.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-b1-1',
        menuItem: MENU_ITEMS[24], // TNT Special Burger
        customization: {
          spiceLevel: 'Kiwi Hot'
        },
        unitPrice: 14.99,
        quantity: 1,
        totalPrice: 14.99
      },
      {
        cartItemId: 'item-f2-1',
        menuItem: MENU_ITEMS[31], // Salted Fries
        unitPrice: 4.99,
        quantity: 1,
        totalPrice: 4.99
      },
      {
        cartItemId: 'item-d2-1',
        menuItem: MENU_ITEMS[36], // Soft Drinks
        unitPrice: 3.00,
        quantity: 2,
        totalPrice: 6.00
      }
    ],
    subtotal: 25.98,
    deliveryFee: 4.99,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 2.00,
    gstAmount: 3.65,
    totalAmount: 27.97,
    estimatedDeliveryTime: 'Arriving in 5 mins',
    status: 'on_the_way',
    store: STORE_LOCATIONS[4]
  },
  {
    orderId: 'ord-105',
    orderNumber: 'TT-892098',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'Chloe Van Der Beek',
      email: 'chloe.vdb@xtra.co.nz',
      phone: '021 992 4110',
      address: '219 Don McKinnon Drive',
      apartmentUnit: '',
      suburb: 'Albany',
      city: 'Auckland',
      postcode: '0632',
      deliveryNotes: 'Delivered to reception at Massey campus building A',
      orderMode: 'delivery',
      storeId: 'albany',
      deliveryTimeType: 'asap',
      paymentMethod: 'apple_google_pay',
      paymentGatewayDetails: {
        gateway: 'Apple Pay NZ / Visa DPS',
        receiptRef: 'APL-DPS-100234'
      },
      tipAmount: 2.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-t2-1',
        menuItem: MENU_ITEMS[37], // Regular Tiffin
        unitPrice: 12.00,
        quantity: 2,
        totalPrice: 24.00
      },
      {
        cartItemId: 'item-r1-1',
        menuItem: MENU_ITEMS[43], // Extra Roti
        unitPrice: 1.50,
        quantity: 2,
        totalPrice: 3.00
      }
    ],
    subtotal: 27.00,
    deliveryFee: 5.49,
    discount: 0.00,
    tip: 2.00,
    gstAmount: 4.50,
    totalAmount: 34.49,
    estimatedDeliveryTime: 'Delivered',
    status: 'delivered',
    store: STORE_LOCATIONS[3]
  },
  {
    orderId: 'ord-106',
    orderNumber: 'TT-892089',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    customerDetails: {
      name: 'David Chen',
      email: 'd.chen@canterbury.ac.nz',
      phone: '021 332 8901',
      address: '182 Oxford Terrace',
      apartmentUnit: '',
      suburb: 'Christchurch Central',
      city: 'Christchurch',
      postcode: '8011',
      deliveryNotes: 'Pickup counter Christchurch',
      orderMode: 'pickup',
      storeId: 'chch-central',
      deliveryTimeType: 'asap',
      paymentMethod: 'windcave_card',
      paymentGatewayDetails: {
        gateway: 'Windcave DPS NZ',
        receiptRef: 'WC-102911-NZ',
        authCode: 'AUTH-OK-3391'
      },
      tipAmount: 1.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-g1-1',
        menuItem: MENU_ITEMS[39], // Special Tiffin
        unitPrice: 17.00,
        quantity: 1,
        totalPrice: 17.00
      },
      {
        cartItemId: 'item-c1-1',
        menuItem: MENU_ITEMS[29], // Cha-Churi
        unitPrice: 14.99,
        quantity: 1,
        totalPrice: 14.99
      }
    ],
    subtotal: 31.99,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 1.00,
    gstAmount: 4.30,
    totalAmount: 32.99,
    estimatedDeliveryTime: 'Delivered',
    status: 'delivered',
    store: STORE_LOCATIONS[5]
  }
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Liam O’Connor',
    email: 'liam.oc@outlook.co.nz',
    phone: '021 553 9102',
    primaryAddress: '210 Queen Street',
    apartmentUnit: 'Apt 12B',
    suburb: 'Auckland Central',
    city: 'Auckland',
    postcode: '1010',
    totalOrders: 14,
    totalSpent: 418.50,
    firstOrderDate: '2025-11-12',
    lastOrderDate: '2026-09-01',
    isVIP: true,
    favoriteItems: ['Allo Paratha', 'Paneer Kulcha', 'Regular Tiffin'],
    notes: 'Loyal corporate lunch customer. Loves mild spice.'
  },
  {
    id: 'cust-2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '021 884 9231',
    primaryAddress: '142 Ponsonby Road',
    apartmentUnit: 'Apt 4B',
    suburb: 'Ponsonby',
    city: 'Auckland',
    postcode: '1011',
    totalOrders: 6,
    totalSpent: 195.40,
    firstOrderDate: '2026-02-14',
    lastOrderDate: '2026-09-01',
    isVIP: false,
    favoriteItems: ['Dahi Bhalla', 'TNT Special Burger', 'Masala Tea'],
    notes: 'Strict peanut allergy.'
  },
  {
    id: 'cust-3',
    name: 'Priya Patel',
    email: 'priya.patel@nzhealth.org.nz',
    phone: '022 419 8832',
    primaryAddress: '48 Hurstmere Road',
    apartmentUnit: 'Suite 2',
    suburb: 'Takapuna',
    city: 'Auckland',
    postcode: '0622',
    totalOrders: 28,
    totalSpent: 789.20,
    firstOrderDate: '2025-08-01',
    lastOrderDate: '2026-09-01',
    isVIP: true,
    favoriteItems: ['Half Half Portion Tiffin', 'Indian Style Veg Maggi', 'Dahi Bhalla'],
    notes: 'Weekly subscriber for Takapuna clinic staff.'
  },
  {
    id: 'cust-4',
    name: 'Hone Morrison',
    email: 'hone.morrison@gmail.com',
    phone: '027 339 1204',
    primaryAddress: '652 Great South Road',
    apartmentUnit: '',
    suburb: 'Manukau',
    city: 'Auckland',
    postcode: '2104',
    totalOrders: 8,
    totalSpent: 264.80,
    firstOrderDate: '2026-04-20',
    lastOrderDate: '2026-09-01',
    isVIP: false,
    favoriteItems: ['Allo Tikki Chat', 'Paneer Roll', 'Loaded Fries'],
    notes: 'Family weekend orders, likes Kiwi Hot spice.'
  },
  {
    id: 'cust-5',
    name: 'Chloe Van Der Beek',
    email: 'chloe.vdb@xtra.co.nz',
    phone: '021 992 4110',
    primaryAddress: '219 Don McKinnon Drive',
    apartmentUnit: '',
    suburb: 'Albany',
    city: 'Auckland',
    postcode: '0632',
    totalOrders: 19,
    totalSpent: 512.90,
    firstOrderDate: '2026-01-10',
    lastOrderDate: '2026-09-01',
    isVIP: true,
    favoriteItems: ['Regular Tiffin', 'Stuffed Kulcha', 'Indian Style Veg Maggi'],
    notes: 'Always orders wholesome comfort food.'
  },
  {
    id: 'cust-6',
    name: 'David Chen',
    email: 'd.chen@canterbury.ac.nz',
    phone: '021 332 8901',
    primaryAddress: '182 Oxford Terrace',
    apartmentUnit: '',
    suburb: 'Christchurch Central',
    city: 'Christchurch',
    postcode: '8011',
    totalOrders: 11,
    totalSpent: 340.20,
    firstOrderDate: '2026-05-18',
    lastOrderDate: '2026-09-01',
    isVIP: false,
    favoriteItems: ['Special Tiffin', 'Cha-Churi', 'Allo Paratha Combo'],
    notes: 'Christchurch regular, pickup customer.'
  }
];
