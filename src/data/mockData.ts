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
    phone: '(09) 309 4521',
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
    phone: '(09) 378 9912',
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
    phone: '(09) 486 3311',
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
    phone: '(09) 415 8890',
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
    phone: '(09) 262 7700',
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
    phone: '(03) 366 2288',
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
  { id: 'ex-cheese', name: 'Extra NZ Mozzarella & Fior di Latte', price: 3.50, category: 'cheese' },
  { id: 'paneer-cubes', name: 'Charred Tandoori Paneer Cubes', price: 3.80, category: 'cheese' },
  { id: 'tandoori-chicken', name: 'Smoked Tandoori Chicken Breast', price: 4.20, category: 'meat' },
  { id: 'lamb-shreds', name: 'Canterbury Roast Spiced Lamb', price: 4.80, category: 'meat' },
  { id: 'pepperoni-cups', name: 'Aged Beef Pepperoni', price: 3.90, category: 'meat' },
  { id: 'wild-mushrooms', name: 'Herb Sautéed Wild Mushrooms', price: 3.00, category: 'veg' },
  { id: 'roasted-peppers', name: 'Fire-Roasted Capsicum & Onions', price: 2.50, category: 'veg' },
  { id: 'pickled-jalapenos', name: 'Pickled Spicy Jalapeños', price: 2.00, category: 'veg' },
  { id: 'baby-spinach', name: 'Fresh Baby Spinach & Basil', price: 2.00, category: 'veg' },
  { id: 'truffle-drizzle', name: 'White Truffle Oil Drizzle', price: 2.80, category: 'sauce' },
  { id: 'peri-peri-aioli', name: 'House Peri-Peri Aioli Swirl', price: 2.00, category: 'sauce' },
  { id: 'makhani-reduction', name: 'Butter Makhani Reduction Dip', price: 2.50, category: 'sauce' }
];

export const MENU_ITEMS: MenuItem[] = [
  // ============================================================================
  // 1. REGULAR (Daily Tiffin Menu - NZD $10.00 each)
  // ============================================================================
  {
    id: 'tiffin-kadhi-pakora',
    name: 'Kadhi Pakora (Monday Special)',
    tagline: 'Monday Tiffin • Crispy gram flour pakoras in tangy spiced yogurt curry',
    category: 'tiffins',
    description: 'Slow-cooked Punjabi style yogurt Kadhi infused with roasted cumin, fenugreek, and ginger, loaded with soft onion-spinach pakoras. Served with 3 hot phulkas/rotis and steamed basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    isChefSpecial: true,
    calories: '620 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis / Phulkas', 'Punjabi Kadhi Pakora', 'Steamed Basmati Rice', 'Spiced Mango Pickle']
  },
  {
    id: 'tiffin-black-chana',
    name: 'Black Chana (Tuesday Special)',
    tagline: 'Tuesday Tiffin • Nutritious black chickpeas simmered in hearty Punjabi masala',
    category: 'tiffins',
    description: 'Traditional spiced Kala Chana cooked in an aromatic onion, ginger, garlic, tomato, and roasted cumin reduction. High in plant protein and fiber, served with 3 soft rotis and fragrant basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'halal'],
    isPopular: true,
    calories: '590 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Wholewheat Rotis', 'Kala Chana Curry', 'Basmati Rice', 'Kachumber Salad']
  },
  {
    id: 'tiffin-daal-tadka',
    name: 'Daal Tadka (Wednesday Special)',
    tagline: 'Wednesday Tiffin • Yellow lentils tempered with cumin, garlic & desi ghee',
    category: 'tiffins',
    description: 'Comforting homestyle yellow toor & moong lentils double-tempered with golden garlic, cumin seeds, dry red chilies, and fresh coriander. Served with 3 handmade rotis and basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '560 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Phulkas', 'Golden Daal Tadka', 'Jeera Basmati Rice', 'Crispy Papadum']
  },
  {
    id: 'tiffin-shalgam-mater',
    name: 'Shalgam Mater (Thursday Special)',
    tagline: 'Thursday Tiffin • Tender turnips & sweet garden peas in spiced Punjabi gravy',
    category: 'tiffins',
    description: 'Homestyle Punjabi Shalgam (turnips) and tender green peas cooked with caramelized onions, tomatoes, ginger, and warm ground spices. Served with 3 hot handmade rotis and rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'halal'],
    isPopular: false,
    calories: '510 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Soft Rotis', 'Shalgam Mater Sabzi', 'Steamed Rice', 'Mango Pickle']
  },
  {
    id: 'tiffin-aloo-pakora',
    name: 'Aloo Pakora (Friday Special)',
    tagline: 'Friday Tiffin • Spiced potato fritters simmered in rich North Indian curry',
    category: 'tiffins',
    description: 'Crispy spiced potato fritters soaked in a rich, flavorful tomato-onion masala with fragrant herbs. The ultimate Friday comfort food, served with 3 hot rotis and basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '640 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis', 'Aloo Pakora Curry', 'Basmati Rice', 'Salad']
  },
  {
    id: 'tiffin-allo-jeera',
    name: 'Allo Jeera (Saturday Special)',
    tagline: 'Saturday Tiffin • Roasted cumin potatoes with fresh herbs & ginger',
    category: 'tiffins',
    description: 'Tender diced potatoes sautéed with toasted roasted cumin seeds, turmeric, ginger, and fresh green chilies. A classic dry Punjabi sabzi served with 3 fluffy phulkas and basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'halal'],
    isPopular: true,
    calories: '550 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Wholewheat Phulkas', 'Allo Jeera Sabzi', 'Basmati Steamed Rice', 'Pickled Chillies']
  },
  {
    id: 'tiffin-mater-paneer',
    name: 'Mater Paneer (Daily / Sunday Special)',
    tagline: 'Daily Favorite • Fresh cottage cheese & sweet peas in spiced tomato gravy',
    category: 'tiffins',
    description: 'Soft fresh cottage cheese cubes and sweet garden peas simmered in a luscious onion-tomato gravy with roasted kasuri methi and garam masala. Served with 3 fresh rotis and basmati rice.',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '670 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis', 'Mater Paneer Curry', 'Jeera Basmati Rice', 'Cucumber Raita']
  },

  // ============================================================================
  // 2. SPECIAL (Specialities & Curries)
  // ============================================================================
  {
    id: 'special-baingan-bharta',
    name: 'Baingan Bharta (Eggplant)',
    tagline: 'Special • Clay-oven smoked eggplant mashed with peas, tomatoes & ginger',
    category: 'tiffins',
    description: 'Smoky fire-roasted whole eggplant slow-cooked with fresh ginger, garlic, tomatoes, green peas, and green chilies. Rich in rustic Punjabi flavors, served with 3 hot butter rotis.',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '530 kcal',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis', 'Smoky Baingan Bharta', 'Basmati Rice', 'Pickle & Salad']
  },
  {
    id: 'special-paneer-burji',
    name: 'Paneer Burji',
    tagline: 'Special • Fresh crumbled paneer sautéed with onions, bell peppers & royal spices',
    category: 'tiffins',
    description: 'Hand-crumbled fresh cottage cheese wok-tossed with finely chopped onions, juicy tomatoes, green capsicum, turmeric, and fresh herbs. Served with 3 warm butter rotis or parathas.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '680 kcal | 28g Protein',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Kiwi Hot',
    includedTiers: ['3 Layered Parathas / Rotis', 'Spiced Paneer Burji', 'Kachumber Salad', 'Mint Chutney']
  },
  {
    id: 'special-sahi-paneer',
    name: 'Sahi Paneer',
    tagline: 'Special • Velvety cashew, cream & cardamom gravy with tender paneer',
    category: 'tiffins',
    description: 'Tender paneer cubes simmered in a silken, royal sauce made with soaked cashews, fresh cream, saffron, and aromatic whole spices. Served with 3 hot butter naans or basmati pilaf.',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '720 kcal',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Mild',
    includedTiers: ['3 Butter Naans / Rotis', 'Royal Sahi Paneer', 'Saffron Basmati Rice', 'Sweet Treat']
  },
  {
    id: 'special-green-soya-beans',
    name: 'Green Soya Beans',
    tagline: 'Special • Fresh tender green soya beans simmered in protein-rich masala',
    category: 'tiffins',
    description: 'Nutritious fresh green soya beans (Hara Chana / Edamame) simmered in a spiced tomato, ginger, garlic, and cumin gravy. High in natural plant-based protein, served with 3 rotis and rice.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'halal'],
    isPopular: false,
    calories: '540 kcal | 26g Protein',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Wholewheat Rotis', 'Green Soya Bean Curry', 'Steamed Rice', 'Salad']
  },

  // ============================================================================
  // 3. WEEKEND SPECIAL & POPULAR EXTRAS
  // ============================================================================
  {
    id: 'weekend-indian-style-kulcha',
    name: 'Indian Style Kulcha',
    tagline: 'Weekend Special • Clay-oven crisped stuffed bread served with spiced chana & tamarind dip',
    category: 'starters',
    description: 'Authentic crispy, layered Amritsari kulcha stuffed with spiced potatoes, onions, and pomegranate seeds, topped with desi butter. Served with tangy Punjabi chole and pickled onions.',
    price: 11.90,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '580 kcal',
    serves: '1 - 2 People',
    customizable: true
  },
  {
    id: 'weekend-chai-and-churi',
    name: 'Chai and Churi',
    tagline: 'Weekend Special • Steaming spiced masala chai paired with warm desi ghee sweet churi',
    category: 'desserts',
    description: 'Traditional Punjabi soul food: freshly rolled hot rotis hand-crushed with pure desi ghee and raw jaggery/shakkar, served alongside a piping hot cup of spiced cardamom ginger karak chai.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg'],
    isPopular: true,
    isChefSpecial: true,
    calories: '490 kcal',
    serves: '1 Person'
  },
  {
    id: 'weekend-dahi-bhalla',
    name: 'Dahi Bhalla',
    tagline: 'Weekend Special • Soft lentil dumplings in chilled spiced yogurt with sweet & mint chutneys',
    category: 'starters',
    description: 'Melt-in-mouth fluffy lentil dumplings immersed in velvety chilled sweetened yogurt, drizzled with tangy tamarind dates chutney, zesty mint chutney, roasted cumin, and crunchy sev.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '380 kcal',
    serves: '1 - 2 People'
  },
  {
    id: 'weekend-allo-takki',
    name: 'Allo Takki',
    tagline: 'Weekend Special • Golden shallow-fried spiced potato patties with chole & chutneys',
    category: 'starters',
    description: 'Two golden-brown crisp spiced potato cutlets topped with warm chickpea curry, whipped spiced yogurt, tamarind chutney, mint chutney, ginger juliennes, and fresh coriander.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '420 kcal',
    serves: '1 - 2 People'
  },
  {
    id: 'special-gym-meal',
    name: 'Gym Meal (High Protein)',
    tagline: 'Fitness Special • Clean protein bowl with paneer/soya, spiced beans, quinoa & greens',
    category: 'tiffins',
    description: 'Designed for fitness enthusiasts: 42g clean protein bowl featuring grilled spiced paneer or soya chunks, steamed green edamame beans, sautéed broccoli, brown basmati / quinoa pilaf, and mint yogurt dressing.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf', 'halal', 'chef-special'],
    isPopular: true,
    calories: '520 kcal | 42g Protein',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['Grilled Spiced Paneer / Soya', 'Steamed Edamame & Broccoli', 'Quinoa Brown Rice Blend', 'Mint Protein Dressing']
  },

  // ============================================================================
  // 4. BEVERAGES & SWEETS
  // ============================================================================
  {
    id: 'drink-masala-chai',
    name: 'Desi Masala Karak Chai',
    tagline: 'Warming ginger, green cardamom & cinnamon brewed tea',
    category: 'drinks',
    description: 'Traditional Punjabi black tea simmered with freshly crushed ginger, green cardamom pods, cinnamon bark, and creamy whole milk.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: true,
    calories: '120 kcal',
    serves: '1 Cup'
  },
  {
    id: 'drink-mango-lassi',
    name: 'Alphonso Mango Lassi (400ml)',
    tagline: 'Chilled creamy yogurt smoothie with pure mango pulp',
    category: 'drinks',
    description: 'Handcrafted with creamy whole milk yogurt, premium Indian Alphonso mango puree, a dash of cardamom, and garnished with roasted pistachios.',
    price: 5.90,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: true,
    calories: '240 kcal',
    serves: '1 Bottle'
  },
  {
    id: 'drink-sweet-lassi',
    name: 'Patiala Sweet Lassi (400ml)',
    tagline: 'Classic Punjabi thick churned sweet lassi with malai',
    category: 'drinks',
    description: 'Thick hand-churned sweet yogurt drink flavored with rosewater, green cardamom, and topped with fresh clotted cream (malai).',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: false,
    calories: '220 kcal',
    serves: '1 Bottle'
  }
];

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 'deal-lunch-tiffin-express',
    title: 'Daily Regular Tiffin Feast Combo',
    badge: 'NZD $15.90 ONLY',
    tagline: 'The ultimate wholesome lunch deal',
    price: 15.90,
    originalPrice: 20.40,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    serves: '1 Person',
    itemsIncluded: [
      '1x Daily Regular Tiffin of the Day (Kadhi/Chana/Daal/Shalgam/Pakora/Allo/Paneer)',
      '1x Chilled Alphonso Mango Lassi or Sweet Lassi',
      '1x Crispy Papadum & Spiced Chutney Pot'
    ],
    description: 'Perfect for office lunches or an authentic homestyle midday meal. Available Monday to Sunday 11:00 AM to 3:00 PM.'
  },
  {
    id: 'deal-special-curry-duo',
    title: 'Punjabi Speciality Duo Feast',
    badge: 'SAVE 20%',
    tagline: 'Choice of Sahi Paneer or Paneer Burji for two',
    price: 28.90,
    originalPrice: 36.00,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    serves: '2 People',
    itemsIncluded: [
      '1x Special Curry (Sahi Paneer or Paneer Burji or Baingan Bharta)',
      '1x Regular Daal Tadka or Kala Chana Curry',
      '6x Hot Butter Rotis / Phulkas & Jeera Rice',
      '2x Cold Mango Lassis'
    ],
    description: 'A generous feast for two featuring our richest chef specials with warm rotis, fragrant rice, and refreshing lassis.'
  },
  {
    id: 'deal-weekend-chaat-kulcha-party',
    title: 'Weekend Kulcha & Chaat Party',
    badge: 'WEEKEND POPULAR',
    tagline: 'Feeds 3 to 4 people generously',
    price: 44.90,
    originalPrice: 58.50,
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    serves: '3 - 4 People',
    itemsIncluded: [
      '2x Indian Style Amritsari Kulcha with Chole',
      '1x Royal Dahi Bhalla Platter',
      '1x Crispy Allo Takki Chaat',
      '2x Chai and Churi Delicacy Sets'
    ],
    description: 'The ultimate weekend family gathering package loaded with stuffed kulchas, street chaat, and sweet desi ghee churi.'
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
    title: '5-Day Daily Regular Tiffin Pass',
    mealsPerWeek: 5,
    pricePerMeal: 10.00,
    weeklyTotal: 50.00,
    badge: 'MOST POPULAR',
    description: 'Hot authentic homestyle tiffin (Kadhi Pakora, Black Chana, Daal Tadka, Shalgam Mater, Aloo Pakora) delivered fresh Monday to Friday.',
    features: [
      'Authentic daily rotating menu straight from our kitchen schedule',
      'Includes 3 rotis, daily curry, steamed basmati rice & pickle',
      'Pause, skip days or cancel anytime via dashboard',
      'Zero delivery fee for Auckland & Christchurch central areas'
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-7-day-dinner',
    title: '7-Day Complete Tiffin Plan (Mon - Sun)',
    mealsPerWeek: 7,
    pricePerMeal: 10.00,
    weeklyTotal: 70.00,
    badge: 'FULL WEEK PASS',
    description: 'Enjoy a complete week of delicious home-cooked meals including Saturday Allo Jeera and Sunday Mater Paneer feasts.',
    features: [
      'Complete 7-day culinary variety without cooking or dishwashing',
      'Includes Weekend Specials & Sunday Mater Paneer',
      'Free weekend Masala Karak Chai included every Saturday',
      'Eco-friendly thermal insulated tiffins'
    ],
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-student-flex',
    title: 'Student & Youth 3-Day Pass',
    mealsPerWeek: 3,
    pricePerMeal: 10.00,
    weeklyTotal: 30.00,
    description: 'Pick any 3 days of the week for wholesome, affordable comfort food.',
    features: [
      'Generous portions with extra phulkas and rice',
      'Pick any 3 days (Mon - Sun)',
      'Free cup of Masala Chai with every tiffin delivery'
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
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
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
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
      allergyNotice: 'No peanuts / strict nut allergy please'
    },
    items: [
      {
        cartItemId: 'item-t1-1',
        menuItem: MENU_ITEMS[0], // Kadhi Pakora (Monday Special)
        customization: {
          spiceLevel: 'Medium'
        },
        unitPrice: 10.00,
        quantity: 2,
        totalPrice: 20.00
      },
      {
        cartItemId: 'item-d1-2',
        menuItem: MENU_ITEMS[17], // Alphonso Mango Lassi
        unitPrice: 5.90,
        quantity: 2,
        totalPrice: 11.80
      }
    ],
    subtotal: 31.80,
    deliveryFee: 4.99,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 3.00,
    gstAmount: 4.54,
    totalAmount: 34.79,
    estimatedDeliveryTime: '25-35 mins',
    status: 'received',
    store: STORE_LOCATIONS[0]
  },
  {
    orderId: 'ord-102',
    orderNumber: 'TT-892104',
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
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
        cartItemId: 'item-t1-2',
        menuItem: MENU_ITEMS[9], // Sahi Paneer
        customization: {
          spiceLevel: 'Mild'
        },
        unitPrice: 13.50,
        quantity: 2,
        totalPrice: 27.00
      },
      {
        cartItemId: 'item-s1-1',
        menuItem: MENU_ITEMS[11], // Indian Style Kulcha
        unitPrice: 11.90,
        quantity: 1,
        totalPrice: 11.90
      }
    ],
    subtotal: 38.90,
    deliveryFee: 4.99,
    discount: 5.84,
    appliedCoupon: 'WELCOME15',
    tip: 3.00,
    gstAmount: 5.35,
    totalAmount: 41.05,
    estimatedDeliveryTime: '20-30 mins',
    status: 'kitchen',
    store: STORE_LOCATIONS[1]
  },
  {
    orderId: 'ord-103',
    orderNumber: 'TT-892102',
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 mins ago
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
        cartItemId: 'item-t3-1',
        menuItem: MENU_ITEMS[8], // Paneer Burji
        customization: {
          spiceLevel: 'Kiwi Hot'
        },
        unitPrice: 13.50,
        quantity: 1,
        totalPrice: 13.50
      },
      {
        cartItemId: 'item-d3-1',
        menuItem: MENU_ITEMS[13], // Dahi Bhalla
        unitPrice: 9.90,
        quantity: 1,
        totalPrice: 9.90
      }
    ],
    subtotal: 23.40,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 2.00,
    gstAmount: 3.31,
    totalAmount: 25.40,
    estimatedDeliveryTime: '15 mins',
    status: 'packed',
    store: STORE_LOCATIONS[2]
  },
  {
    orderId: 'ord-104',
    orderNumber: 'TT-892101',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 mins ago
    customerDetails: {
      name: 'Hone Morrison',
      email: 'hone.morrison@gmail.com',
      phone: '027 339 1204',
      address: '652 Great South Road',
      apartmentUnit: '',
      suburb: 'Manukau',
      city: 'Auckland',
      postcode: '2104',
      deliveryNotes: 'Drive up driveway on left, knock twice.',
      orderMode: 'delivery',
      storeId: 'manukau',
      deliveryTimeType: 'asap',
      paymentMethod: 'afterpay_nz',
      paymentGatewayDetails: {
        gateway: 'Afterpay NZ (4x Installments)',
        installmentAmount: 8.75,
        receiptRef: 'AP-NZ-660192'
      },
      tipAmount: 2.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-t4-1',
        menuItem: MENU_ITEMS[6], // Mater Paneer
        customization: {
          spiceLevel: 'Medium'
        },
        unitPrice: 10.00,
        quantity: 2,
        totalPrice: 20.00
      },
      {
        cartItemId: 'item-s4-1',
        menuItem: MENU_ITEMS[14], // Allo Takki
        unitPrice: 9.90,
        quantity: 1,
        totalPrice: 9.90
      }
    ],
    subtotal: 29.90,
    deliveryFee: 4.99,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 2.00,
    gstAmount: 4.16,
    totalAmount: 31.89,
    estimatedDeliveryTime: 'Arriving in 5 mins',
    status: 'on_the_way',
    store: STORE_LOCATIONS[4]
  },
  {
    orderId: 'ord-105',
    orderNumber: 'TT-892098',
    createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(), // 1 hr 15 mins ago
    customerDetails: {
      name: 'Emily Zhang',
      email: 'emily.zhang@massey.ac.nz',
      phone: '021 993 4410',
      address: '219 Don McKinnon Drive',
      apartmentUnit: 'Apt 14',
      suburb: 'Albany',
      city: 'Auckland',
      postcode: '0632',
      deliveryNotes: 'Delivered at front desk',
      orderMode: 'delivery',
      storeId: 'albany',
      deliveryTimeType: 'asap',
      paymentMethod: 'apple_google_pay',
      paymentGatewayDetails: {
        gateway: 'Apple Pay NZ / Visa DPS',
        receiptRef: 'APL-DPS-100234'
      },
      tipAmount: 2.00,
      allergyNotice: 'Vegan meal option'
    },
    items: [
      {
        cartItemId: 'item-t2-1',
        menuItem: MENU_ITEMS[1], // Black Chana (Vegan)
        unitPrice: 10.00,
        quantity: 2,
        totalPrice: 20.00
      }
    ],
    subtotal: 20.00,
    deliveryFee: 5.49,
    discount: 0.00,
    tip: 2.00,
    gstAmount: 3.59,
    totalAmount: 27.49,
    estimatedDeliveryTime: 'Delivered',
    status: 'delivered',
    store: STORE_LOCATIONS[3]
  },
  {
    orderId: 'ord-106',
    orderNumber: 'TT-892094',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(), // ~2 hrs ago
    customerDetails: {
      name: 'Callum Taylor',
      email: 'callum.taylor@canty.co.nz',
      phone: '027 662 3199',
      address: '182 Oxford Terrace',
      apartmentUnit: 'Level 3',
      suburb: 'Christchurch Central',
      city: 'Christchurch',
      postcode: '8011',
      deliveryNotes: 'Pickup at counter',
      orderMode: 'pickup',
      storeId: 'chch-central',
      deliveryTimeType: 'asap',
      paymentMethod: 'cash_eftpos_delivery',
      paymentGatewayDetails: {
        gateway: 'Paid at Christchurch Counter EFTPOS',
        receiptRef: 'POS-CHCH-4419'
      },
      tipAmount: 1.00,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-g1-1',
        menuItem: MENU_ITEMS[15], // Gym Meal (High Protein)
        unitPrice: 14.50,
        quantity: 1,
        totalPrice: 14.50
      },
      {
        cartItemId: 'item-c1-1',
        menuItem: MENU_ITEMS[12], // Chai and Churi
        unitPrice: 9.90,
        quantity: 1,
        totalPrice: 9.90
      }
    ],
    subtotal: 24.40,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 1.00,
    gstAmount: 3.31,
    totalAmount: 25.40,
    estimatedDeliveryTime: 'Delivered',
    status: 'delivered',
    store: STORE_LOCATIONS[5]
  }
];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@gmail.com',
    phone: '021 884 9231',
    primaryAddress: '142 Ponsonby Road, Apt 4B',
    suburb: 'Ponsonby',
    city: 'Auckland',
    totalOrders: 14,
    totalSpent: 684.50,
    firstOrderDate: '2025-11-12',
    lastOrderDate: '2026-08-31',
    isVIP: true,
    favoriteItems: ['Sahi Paneer', 'Indian Style Kulcha', 'Mater Paneer'],
    notes: 'Loyal corporate lunch customer. Loves mild spice.'
  },
  {
    id: 'cust-2',
    name: 'Liam O’Connor',
    email: 'liam.oc@outlook.co.nz',
    phone: '021 553 9102',
    primaryAddress: '210 Queen Street, Apt 12B',
    suburb: 'Auckland Central',
    city: 'Auckland',
    totalOrders: 8,
    totalSpent: 342.20,
    firstOrderDate: '2026-02-14',
    lastOrderDate: '2026-08-31',
    isVIP: false,
    favoriteItems: ['Kadhi Pakora', 'Alphonso Mango Lassi'],
    notes: 'Strict peanut allergy.'
  },
  {
    id: 'cust-3',
    name: 'Priya Patel',
    email: 'priya.patel@nzhealth.org.nz',
    phone: '022 419 8832',
    primaryAddress: '48 Hurstmere Road, Suite 2',
    suburb: 'Takapuna',
    city: 'Auckland',
    totalOrders: 22,
    totalSpent: 1045.80,
    firstOrderDate: '2025-08-01',
    lastOrderDate: '2026-08-31',
    isVIP: true,
    favoriteItems: ['Paneer Burji', 'Dahi Bhalla', 'Kadhi Pakora'],
    notes: 'Weekly subscriber for Takapuna clinic staff.'
  },
  {
    id: 'cust-4',
    name: 'Hone Morrison',
    email: 'hone.morrison@gmail.com',
    phone: '027 339 1204',
    primaryAddress: '652 Great South Road',
    suburb: 'Manukau',
    city: 'Auckland',
    totalOrders: 6,
    totalSpent: 318.00,
    firstOrderDate: '2026-04-20',
    lastOrderDate: '2026-08-31',
    isVIP: false,
    favoriteItems: ['Mater Paneer', 'Allo Takki', 'Baingan Bharta'],
    notes: 'Family weekend orders, likes Kiwi Hot spice.'
  },
  {
    id: 'cust-5',
    name: 'Emily Zhang',
    email: 'emily.zhang@massey.ac.nz',
    phone: '021 993 4410',
    primaryAddress: '219 Don McKinnon Drive, Apt 14',
    suburb: 'Albany',
    city: 'Auckland',
    totalOrders: 11,
    totalSpent: 420.50,
    firstOrderDate: '2026-01-10',
    lastOrderDate: '2026-08-31',
    isVIP: true,
    favoriteItems: ['Black Chana (Tuesday Special)', 'Shalgam Mater'],
    notes: 'Always orders 100% Vegan.'
  },
  {
    id: 'cust-6',
    name: 'Callum Taylor',
    email: 'callum.taylor@canty.co.nz',
    phone: '027 662 3199',
    primaryAddress: '182 Oxford Terrace, Level 3',
    suburb: 'Christchurch Central',
    city: 'Christchurch',
    totalOrders: 5,
    totalSpent: 215.40,
    firstOrderDate: '2026-05-18',
    lastOrderDate: '2026-08-31',
    isVIP: false,
    favoriteItems: ['Gym Meal (High Protein)', 'Chai and Churi'],
    notes: 'Christchurch regular, pickup customer.'
  }
];

