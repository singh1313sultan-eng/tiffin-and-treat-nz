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
  // TIFFIN & THALIS
  {
    id: 'tiffin-royal-maharani',
    name: 'The Royal 4-Tier Gourmet Tiffin',
    tagline: 'Our signature multi-tier hot tiffin feast',
    category: 'tiffins',
    description: 'Freshly packed in insulated containers: 3 handmade butter rotis, Shahi Paneer or Butter Chicken, 18-hour slow Dal Makhani, fragrant Jeera Basmati Rice, cucumber mint raita, and 2 warm Gulab Jamuns.',
    price: 24.90,
    originalPrice: 28.50,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '890 kcal',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['3 Hot Butter Rotis / Naan', 'Choice of Royal Curry', 'Slow-cooked Dal Makhani', 'Jeera Basmati Pilaf', 'Cucumber Mint Raita & Gulab Jamun']
  },
  {
    id: 'tiffin-homestyle-dabba',
    name: 'Homestyle Desi Dabba Box',
    tagline: 'Just like mum made — comforting & wholesome',
    category: 'tiffins',
    description: '4 hot wholewheat phulkas, homestyle seasonal sabzi, comforting yellow tadka dal, steaming aromatic basmati rice, crispy papadum, spiced mango pickle & sweet treat.',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '720 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium',
    includedTiers: ['4 Soft Phulkas', 'Seasonal Vegetable Sabzi', 'Yellow Tadka Dal', 'Basmati Steamed Rice', 'Papadum & Mango Pickle']
  },
  {
    id: 'tiffin-protein-power',
    name: 'Tandoori Protein Power Tiffin',
    tagline: 'High protein, clean nourishment',
    category: 'tiffins',
    description: 'Generous portion of succulent char-grilled Tandoori chicken breast (or grilled Soya Chaap), spiced high-protein chickpea salad, quinoa & basmati blend, yellow lentil stew, and mint yogurt dip.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'gf'],
    isPopular: false,
    calories: '680 kcal | 52g Protein',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Kiwi Hot'
  },
  {
    id: 'tiffin-vegan-vitality',
    name: 'Vegan Vitality Harvest Tiffin',
    tagline: '100% Plant-based comfort feast',
    category: 'tiffins',
    description: '3 fresh Methi Theplas (fenugreek flatbreads), coconut vegetable korma, Amritsari Chana Masala, turmeric spiced rice, fresh kachumber salad, and dairy-free mango chia pudding.',
    price: 21.50,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'dairy-free'],
    isPopular: false,
    calories: '640 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'tiffin-student-express',
    name: 'Express Lunch Tiffin Deal',
    tagline: 'Quick, filling lunch special',
    category: 'tiffins',
    description: '2 layered buttery parathas with your choice of Shahi Paneer or Butter Chicken, fragrant rice, and house pickled onions.',
    price: 15.90,
    originalPrice: 18.50,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal'],
    isPopular: true,
    calories: '610 kcal',
    serves: '1 Person',
    customizable: true,
    defaultSpice: 'Medium'
  },

  // ARTISANAL & FUSION PIZZAS
  {
    id: 'pizza-butter-chicken-supreme',
    name: 'Auckland Butter Chicken Supreme',
    tagline: 'Our best-selling iconic fusion masterpiece',
    category: 'pizzas',
    description: 'Slow-simmered rich makhani tomato reduction, tender tandoori chicken thigh, red Spanish onions, bell peppers, fresh NZ mozzarella, garnished with fresh cilantro and spiced garlic butter drizzle.',
    price: 21.90,
    originalPrice: 24.50,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '1120 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'pizza-paneer-tikka-feast',
    name: 'Royal Paneer Tikka Feast',
    tagline: 'Smoky spiced cottage cheese with creamy gravy',
    category: 'pizzas',
    description: 'Charred tandoori paneer cubes, roasted capsicum, red onion rings, fresh green chilies, NZ mozzarella on a rich fenugreek spiced sauce, finished with fresh mint chutney swirl.',
    price: 20.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '1050 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Kiwi Hot'
  },
  {
    id: 'pizza-smoky-lamb-peri-peri',
    name: 'Canterbury Smoky Lamb & Peri-Peri',
    tagline: 'Slow roasted NZ Canterbury lamb shreds',
    category: 'pizzas',
    description: '12-hour braised spiced lamb shoulder, baby spinach, caramelized Spanish onions, roasted garlic cloves, creamy mozzarella, topped with our fiery house peri-peri drizzle.',
    price: 23.90,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'chef-special'],
    isPopular: true,
    calories: '1190 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Kiwi Hot'
  },
  {
    id: 'pizza-truffle-wild-mushroom',
    name: 'Truffle & Wild Forest Mushroom',
    tagline: 'Earthy luxury with Italian white truffle essence',
    category: 'pizzas',
    description: 'Sautéed portobello and button mushrooms, roasted garlic white crema, Fior di Latte mozzarella, aged parmesan shavings, fresh garden thyme, and aromatic white truffle oil.',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg'],
    isPopular: false,
    calories: '980 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Mild'
  },
  {
    id: 'pizza-fiery-vindaloo',
    name: 'Fiery Goan Vindaloo Flame',
    tagline: 'For true spice connoisseurs',
    category: 'pizzas',
    description: 'Tangy red vindaloo chili base, pulled marinated chicken or beef, pickled jalapeños, crispy fried shallots, cracked black pepper, and melted mozzarella.',
    price: 21.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'spicy'],
    isPopular: false,
    calories: '1090 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Indian Fire 🔥'
  },
  {
    id: 'pizza-double-pepperoni-hot-honey',
    name: 'Artisan Double Pepperoni & Hot Honey',
    tagline: 'Crispy cupping pepperoni with habanero blossom honey',
    category: 'pizzas',
    description: 'Layers of crispy beef pepperoni cups, rich San Marzano tomato sauce, double mozzarella, finished with a generous drizzle of hot chili-infused blossom honey.',
    price: 21.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal'],
    isPopular: true,
    calories: '1150 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'pizza-classic-margherita',
    name: 'Classic Margherita D.O.P',
    tagline: 'Simple, authentic perfection',
    category: 'pizzas',
    description: 'Sweet San Marzano crushed tomato sauce, fresh buffalo mozzarella, fragrant whole sweet basil leaves, extra virgin olive oil, and sea salt flakes.',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg'],
    isPopular: true,
    calories: '890 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Mild'
  },
  {
    id: 'pizza-tandoori-garlic-prawn',
    name: 'Coastal Tandoori Garlic Prawn',
    tagline: 'Succulent king prawns with lime & garlic cream',
    category: 'pizzas',
    description: 'Marinated juicy king tiger prawns, sweet cherry tomatoes, roasted garlic cloves, baby spinach, mozzarella, fresh dill, and zesty lime cream swirl.',
    price: 24.90,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'chef-special'],
    isPopular: false,
    isChefSpecial: true,
    calories: '1020 kcal (Large)',
    serves: '2 - 3 People',
    customizable: true,
    supportsHalfHalf: true,
    defaultSpice: 'Medium'
  },

  // STREET TREATS & STARTERS
  {
    id: 'side-samosa-chaat',
    name: 'Royal Samosa Chaat Platter',
    tagline: 'Crisp handmade samosas with spiced chutneys',
    category: 'starters',
    description: 'Two golden potato & pea samosas crushed and layered with warm spiced chana masala, chilled sweet yogurt, tangy tamarind & mint chutney, fresh pomegranate, and crispy sev.',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal'],
    isPopular: true,
    calories: '480 kcal',
    serves: '1 - 2 People'
  },
  {
    id: 'side-cheesy-garlic-naan-sticks',
    name: 'Stuffed Cheesy Garlic Naan-Sticks',
    tagline: 'Oven-baked cheesy perfection with makhani dip',
    category: 'starters',
    description: 'Eight pieces of freshly baked garlic & herb dough sticks stuffed with molten cheddar & mozzarella, served with a pot of warm butter chicken / makhani gravy dip.',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg'],
    isPopular: true,
    calories: '540 kcal',
    serves: '2 - 3 People'
  },
  {
    id: 'side-chicken-tikka-skewers',
    name: 'Charred Chicken Tikka Skewers (4 pcs)',
    tagline: 'Smoky clay-oven grilled boneless chicken',
    category: 'starters',
    description: 'Succulent boneless chicken thigh pieces marinated overnight in yogurt, Kashmiri paprika, and roasted spices, served with fresh lemon wedges and mint coriander yogurt dip.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'gf'],
    isPopular: true,
    calories: '420 kcal | 40g Protein',
    serves: '2 People'
  },
  {
    id: 'side-gunpowder-fries',
    name: 'Gunpowder Masala Crinkle Fries',
    tagline: 'Crisp fries with southern Indian aromatic spices',
    category: 'starters',
    description: 'Crunchy golden fries tossed in our secret Southern Indian gunpowder podi spice mix, served with garlic aioli and sweet chili dip.',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'gf'],
    isPopular: false,
    calories: '390 kcal',
    serves: '1 - 2 People'
  },
  {
    id: 'side-crispy-amritsari-fish',
    name: 'Crispy Amritsari Fish Bites',
    tagline: 'Ajwain & gram flour spiced fish goujons',
    category: 'starters',
    description: 'Lightly battered fresh fish fillets seasoned with carom seeds and chaat masala, fried until golden and crisp. Served with spicy tartare and lemon.',
    price: 15.90,
    image: 'https://images.unsplash.com/photo-1535007802871-4131f70c4417?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'gf'],
    isPopular: false,
    calories: '450 kcal',
    serves: '2 People'
  },

  // BIRYANI & RICE BOWLS
  {
    id: 'biryani-hyderabadi-dum-chicken',
    name: 'Hyderabadi Dum Chicken Biryani',
    tagline: 'Slow steam cooked with saffron & caramelized onions',
    category: 'biryani',
    description: 'Long-grain royal basmati rice cooked in traditional sealed pot with tender bone-in spiced chicken, whole spices, mint, saffron, accompanied by rich Mirchi Ka Salan curry and chilled raita.',
    price: 21.90,
    originalPrice: 24.00,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    dietary: ['halal', 'chef-special', 'gf'],
    isPopular: true,
    isChefSpecial: true,
    calories: '860 kcal',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Medium'
  },
  {
    id: 'biryani-royal-nizam-veg',
    name: 'Royal Shahi Paneer & Veg Biryani',
    tagline: 'Fragrant garden vegetables & golden paneer',
    category: 'biryani',
    description: 'Layers of fragrant basmati rice with marinated paneer cubes, french beans, carrots, green peas, roasted cashews, fried onions, and kewra water. Served with cooling cucumber raita.',
    price: 19.90,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'halal', 'gf'],
    isPopular: false,
    calories: '740 kcal',
    serves: '1 - 2 People',
    customizable: true,
    defaultSpice: 'Medium'
  },

  // DESSERTS & SWEET TREATS
  {
    id: 'dessert-gulab-jamun-cheesecake',
    name: 'Gulab Jamun Baked Cheesecake',
    tagline: 'Our signature East-meets-West dessert',
    category: 'desserts',
    description: 'Creamy New York style vanilla baked cheesecake with embedded warm cardamon-scented gulab jamun dumplings on a spiced biscuit crumb, topped with crushed pistachios & edible rose petals.',
    price: 10.90,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'chef-special'],
    isPopular: true,
    isChefSpecial: true,
    calories: '420 kcal',
    serves: '1 Person'
  },
  {
    id: 'dessert-molten-lava-cake',
    name: 'Warm Belgian Chocolate Lava Cake',
    tagline: 'Gooey decadent molten chocolate core',
    category: 'desserts',
    description: 'Rich dark chocolate sponge with a warm flowing liquid fudge centre, served with a cup of NZ vanilla bean ice cream.',
    price: 9.90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg'],
    isPopular: true,
    calories: '460 kcal',
    serves: '1 Person'
  },
  {
    id: 'dessert-mango-kulfi-pot',
    name: 'Royal Alphonso Mango Kulfi Pot',
    tagline: 'Traditional slow-reduced frozen dairy dessert',
    category: 'desserts',
    description: 'Silky frozen Indian ice cream made from slow simmered milk infused with real Alphonso mango pulp, saffron, cardamom, and almond slivers in a traditional earthen pot.',
    price: 7.90,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: false,
    calories: '280 kcal',
    serves: '1 Person'
  },
  {
    id: 'dessert-pistachio-rasmalai',
    name: 'Saffron & Pistachio Rasmalai (2 pcs)',
    tagline: 'Delicate milk dumplings in saffron cream',
    category: 'desserts',
    description: 'Soft, spongy cottage cheese patties soaked in luscious thickened saffron and green cardamom milk, garnished with toasted pistachios.',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: false,
    calories: '310 kcal',
    serves: '1 Person'
  },

  // BEVERAGES & LASSIS
  {
    id: 'drink-alphonso-mango-lassi',
    name: 'Velvety Alphonso Mango Lassi (400ml)',
    tagline: 'Chilled creamy yogurt smoothie with pure mango',
    category: 'drinks',
    description: 'Handcrafted with creamy whole milk yogurt, premium Indian Alphonso mango puree, a dash of cardamom, and garnished with roasted pistachios.',
    price: 6.90,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: true,
    calories: '240 kcal',
    serves: '1 Person'
  },
  {
    id: 'drink-rose-cardamom-lassi',
    name: 'Royal Rose & Cardamom Lassi',
    tagline: 'Fragrant sweet yogurt refresher',
    category: 'drinks',
    description: 'Refreshing yogurt cooler flavored with organic Damascus rose syrup and crushed cardamoms.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: false,
    calories: '210 kcal',
    serves: '1 Person'
  },
  {
    id: 'drink-masala-chai-flask',
    name: 'Freshly Brewed Masala Chai Flask',
    tagline: 'Warming ginger, cardamom & cinnamon tea',
    category: 'drinks',
    description: 'Traditional Assam CTC black tea simmered with fresh crushed ginger, green cardamom pods, cinnamon, and whole milk. Serves 2 cups.',
    price: 5.90,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    dietary: ['veg', 'gf'],
    isPopular: true,
    calories: '150 kcal',
    serves: '2 Cups'
  },
  {
    id: 'drink-nz-craft-soda',
    name: 'NZ Artisan Organic Feijoa Soda',
    tagline: 'Crisp sparkling local fruit soda',
    category: 'drinks',
    description: 'Crafted locally in New Zealand using real organic feijoa juice and lightly sparkling artesian spring water.',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    dietary: ['vegan', 'veg', 'gf'],
    isPopular: false,
    calories: '95 kcal',
    serves: '1 Can (330ml)'
  }
];

export const COMBO_DEALS: ComboDeal[] = [
  {
    id: 'deal-lunch-tiffin-express',
    title: 'Weekday Tiffin Express Lunch',
    badge: 'NZD $15.90 ONLY',
    tagline: 'The ultimate lunchtime power deal',
    price: 15.90,
    originalPrice: 23.50,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    serves: '1 Person',
    itemsIncluded: [
      '1x Homestyle Tiffin Box or Paratha Curry Set',
      '1x Chilled Mango Lassi or NZ Craft Soda',
      '1x Sweet Treat (Warm Gulab Jamun)'
    ],
    description: 'Perfect for office lunches or a quick wholesome midday meal. Available Monday to Friday 11:30 AM to 3:00 PM.'
  },
  {
    id: 'deal-tiffin-and-pizza-duo',
    title: 'The Tiffin & Pizza Duo Feast',
    badge: 'SAVE 25%',
    tagline: 'Best of both worlds for two',
    price: 39.90,
    originalPrice: 53.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    serves: '2 - 3 People',
    itemsIncluded: [
      '1x Large Gourmet / Fusion Pizza of Choice',
      '1x Royal 4-Tier Gourmet Tiffin or Dum Biryani',
      '1x Cheesy Garlic Naan Sticks (8 pcs) with Dip',
      '2x Cold Drinks (Lassi or Soda)'
    ],
    description: 'Cannot decide between a comforting hot curry tiffin and a sizzling artisanal pizza? Get both with sides and drinks!'
  },
  {
    id: 'deal-family-mega-banquet',
    title: 'Grand Family Feast & Treats',
    badge: 'FAMILY COMBO',
    tagline: 'Feeds 4 to 6 people generously',
    price: 69.90,
    originalPrice: 94.50,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    serves: '4 - 6 People',
    itemsIncluded: [
      '2x Large Gourmet Artisanal Pizzas',
      '1x Hyderabadi Dum Chicken or Veg Biryani',
      '1x Royal Samosa Chaat Platter',
      '1x Stuffed Cheesy Garlic Naan-Sticks',
      '2x Gulab Jamun Cheesecakes or Lava Cakes',
      '1x 1.5L Beverage of Choice'
    ],
    description: 'The ultimate weekend family gathering package loaded with entrees, mains, pizzas, and indulgent desserts.'
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
    description: '$5.00 off on any tiffin or pizza order over $30',
    discountType: 'fixed',
    discountValue: 5.00,
    minOrder: 30
  },
  {
    code: 'FEAST20',
    description: '20% off on family orders over $60',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 60
  }
];

export const WEEKLY_SUBSCRIPTION_PLANS: WeeklySubscriptionPlan[] = [
  {
    id: 'sub-5-day-lunch',
    title: '5-Day Weekday Lunch Pass',
    mealsPerWeek: 5,
    pricePerMeal: 15.50,
    weeklyTotal: 77.50,
    badge: 'MOST POPULAR FOR OFFICE',
    description: 'Hot gourmet tiffin delivered directly to your office desk or home every Monday to Friday between 11:45 AM and 1:00 PM.',
    features: [
      'Rotated daily menu with 5 unique authentic menus every week',
      'Hot thermal dabba insulation keeps food steaming hot',
      'Pause, skip days or cancel anytime via online dashboard',
      'Zero delivery fee for central Auckland business zones'
    ],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-7-day-dinner',
    title: '7-Day Complete Dinner Plan',
    mealsPerWeek: 7,
    pricePerMeal: 16.90,
    weeklyTotal: 118.30,
    badge: 'SAVE $30 / WEEK',
    description: 'Never worry about dinner cooking or cleaning. 7 healthy, nourishing homestyle meals delivered fresh between 6:00 PM and 7:30 PM.',
    features: [
      'Complete balanced meal: 4 Rotis, 2 Curries (Dal + Sabzi/Chicken), Rice & Salad',
      'Customizable dietary preferences (Strict Veg, Halal, Jain, Keto)',
      'Free weekend dessert treat included every Saturday',
      'Eco-friendly returnable stainless steel tiffins'
    ],
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sub-student-flex',
    title: 'Student & Youth Flexible Pass (3 Days)',
    mealsPerWeek: 3,
    pricePerMeal: 14.50,
    weeklyTotal: 43.50,
    description: 'Pick any 3 days of the week for hearty comforting food that fuels your study sessions without breaking the bank.',
    features: [
      'Huge portions with extra rotis and rice',
      'Pick any 3 days (Mon-Sun)',
      'Free soft drink can with every tiffin delivery'
    ],
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
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
      tipAmount: 4.00,
      allergyNotice: 'No peanuts / strict nut allergy please'
    },
    items: [
      {
        cartItemId: 'item-p1-1',
        menuItem: MENU_ITEMS[0], // Butter Chicken Supreme Pizza
        customization: {
          size: 'Jumbo 15"',
          crust: 'Cheese-Burst Stuffed Crust (+NZD $4.50)',
          spiceLevel: 'Kiwi Hot'
        },
        unitPrice: 32.40,
        quantity: 1,
        totalPrice: 32.40
      },
      {
        cartItemId: 'item-d1-2',
        menuItem: MENU_ITEMS[14], // Royal Mango Kesar Lassi
        unitPrice: 7.50,
        quantity: 2,
        totalPrice: 15.00
      }
    ],
    subtotal: 47.40,
    deliveryFee: 4.99,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 4.00,
    gstAmount: 7.71,
    totalAmount: 51.39,
    estimatedDeliveryTime: '30-40 mins',
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
        cartItemId: 'item-t1-1',
        menuItem: MENU_ITEMS[4], // Royal Maharaja 5-Tier Tiffin
        customization: {
          tiffinMealChoice: 'Paneer Butter Masala + Dal Makhani + Garlic Naan',
          spiceLevel: 'Medium'
        },
        unitPrice: 24.90,
        quantity: 2,
        totalPrice: 49.80
      },
      {
        cartItemId: 'item-s1-1',
        menuItem: MENU_ITEMS[8], // Crispy Onion & Spinach Bhaji Bites
        unitPrice: 10.90,
        quantity: 1,
        totalPrice: 10.90
      }
    ],
    subtotal: 60.70,
    deliveryFee: 0.00, // free over $60
    discount: 9.11,
    appliedCoupon: 'WELCOME15',
    tip: 3.00,
    gstAmount: 8.19,
    totalAmount: 54.59,
    estimatedDeliveryTime: '25-35 mins',
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
      deliveryNotes: 'Pickup at counter counter by Priya',
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
      allergyNotice: 'Gluten free base preferred for pizza'
    },
    items: [
      {
        cartItemId: 'item-p2-1',
        menuItem: MENU_ITEMS[1], // Tandoori Paneer Tikka Gourmet Pizza
        customization: {
          size: 'Large 12"',
          crust: 'Gluten-Free Base (+NZD $4.00)',
          spiceLevel: 'Indian Fire 🔥'
        },
        unitPrice: 28.90,
        quantity: 1,
        totalPrice: 28.90
      },
      {
        cartItemId: 'item-d2-1',
        menuItem: MENU_ITEMS[12], // Warm Gulab Jamun Sundae
        unitPrice: 9.50,
        quantity: 1,
        totalPrice: 9.50
      }
    ],
    subtotal: 38.40,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 2.00,
    gstAmount: 6.06,
    totalAmount: 40.40,
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
        installmentAmount: 16.72,
        receiptRef: 'AP-NZ-660192'
      },
      tipAmount: 3.50,
      allergyNotice: ''
    },
    items: [
      {
        cartItemId: 'item-p4-1',
        menuItem: MENU_ITEMS[3], // Smoky Lamb Rogan Josh Pizza
        customization: {
          size: 'Jumbo 15"',
          crust: 'Garlic Butter Infused Crust (+NZD $2.50)',
          spiceLevel: 'Kiwi Hot'
        },
        unitPrice: 32.40,
        quantity: 1,
        totalPrice: 32.40
      },
      {
        cartItemId: 'item-b1-1',
        menuItem: MENU_ITEMS[10], // Hyderabadi Dum Biryani Feast
        unitPrice: 21.90,
        quantity: 1,
        totalPrice: 21.90
      },
      {
        cartItemId: 'item-d1-3',
        menuItem: MENU_ITEMS[14], // Royal Mango Kesar Lassi
        unitPrice: 7.50,
        quantity: 2,
        totalPrice: 15.00
      }
    ],
    subtotal: 69.30,
    deliveryFee: 0.00,
    discount: 5.00,
    appliedCoupon: 'TIFFIN5',
    tip: 3.50,
    gstAmount: 10.17,
    totalAmount: 67.80,
    estimatedDeliveryTime: 'Arriving in 8 mins',
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
      tipAmount: 2.50,
      allergyNotice: 'Vegan meal option'
    },
    items: [
      {
        cartItemId: 'item-t2-1',
        menuItem: MENU_ITEMS[5], // Homestyle Daily 4-Tier Tiffin (Vegan)
        unitPrice: 19.90,
        quantity: 2,
        totalPrice: 39.80
      }
    ],
    subtotal: 39.80,
    deliveryFee: 5.49,
    discount: 0.00,
    tip: 2.50,
    gstAmount: 7.17,
    totalAmount: 47.79,
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
        cartItemId: 'item-p3-1',
        menuItem: MENU_ITEMS[2], // Paneer & Chicken Fusion Half & Half
        unitPrice: 26.90,
        quantity: 1,
        totalPrice: 26.90
      },
      {
        cartItemId: 'item-d3-1',
        menuItem: MENU_ITEMS[13], // Pistachio Kulfi Gelato Tub
        unitPrice: 8.50,
        quantity: 2,
        totalPrice: 17.00
      }
    ],
    subtotal: 43.90,
    deliveryFee: 0.00,
    discount: 0.00,
    tip: 1.00,
    gstAmount: 6.74,
    totalAmount: 44.90,
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
    favoriteItems: ['Royal Maharaja 5-Tier Tiffin', 'Butter Chicken Supreme Pizza'],
    notes: 'Loyal corporate lunch customer. Prefers mild spice.'
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
    favoriteItems: ['Tandoori Paneer Tikka Gourmet Pizza', 'Royal Mango Kesar Lassi'],
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
    favoriteItems: ['Homestyle Daily 4-Tier Tiffin', 'Gluten-Free Pizza Base'],
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
    favoriteItems: ['Smoky Lamb Rogan Josh Pizza', 'Hyderabadi Dum Biryani Feast'],
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
    favoriteItems: ['Vegan Delight Tiffin', 'Onion Bhaji Bites'],
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
    favoriteItems: ['Half & Half Pizza Studio', 'Pistachio Kulfi Gelato'],
    notes: 'Christchurch regular, pickup customer.'
  }
];

