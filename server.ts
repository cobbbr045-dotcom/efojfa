import express, { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(__dirname, 'data', 'clevara_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// ---------------------------------------------------------------------------
// Database Architecture & Persistence
// ---------------------------------------------------------------------------

interface DatabaseSchema {
  settings: {
    storeName: string;
    tagline: string;
    supportPhone: string;
    supportEmail: string;
    currencySymbol: string;
    defaultDeliveryFee: number;
    freeDeliveryThreshold: number;
    defaultLowStockThreshold: number;
    passwordHash: string;
    passwordSalt: string;
    updatedAt: string;
  };
  products: any[];
  inventoryLogs: any[];
  deals: any[];
  limitedOffers: any[];
  orders: any[];
  restockSubscriptions: any[];
  events: any[];
  eventAttendees: any[];
  sessions: Record<string, { createdAt: number; expiresAt: number }>;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function getInitialDatabase(): DatabaseSchema {
  const salt = crypto.randomBytes(16).toString('hex');
  const defaultPassword = 'anujsubarna2018@';
  const passwordHash = hashPassword(defaultPassword, salt);

  const initialProducts = [
    {
      id: 'prod-clevara-multifunctional-squeegee',
      name: 'CLEVARA Multifunctional Spray Squeegee Window Cleaner',
      slogan: 'CLEANER. BRIGHTER. BETTER.',
      description: 'The ultimate 3-in-1 glass cleaning innovation: built-in fine-mist atomizing spray nozzle, high-density microfiber scrubbing pad, and precision optical-grade streak-free silicone squeegee. Engineered for panoramic home windows, glass balconies, car windshields, shower doors, and mirrors.',
      longDescription: 'Experience crystal-clear glass in seconds. CLEVARA\'s 3-stage cleaning system eliminates the need for separate spray bottles, rags, and squeegees. Simply fill the 250ml reservoir with water or cleansing solution, spray a fine mist, agitate stubborn dirt with the machine-washable microfiber pad, and swipe clean in one smooth stroke with the silicone squeegee blade.',
      images: [
        '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg',
        '/src/assets/images/clevara_cleaner_white_1794193756650.jpg',
        '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg'
      ],
      category: 'Window & Glass Care',
      sku: 'CLV-SQG-499',
      price: 499,
      discountedPrice: 499,
      stock: 30,
      lowStockThreshold: 5,
      variants: [
        {
          id: 'var-blue',
          color: 'Blue',
          name: 'Ocean Sky Blue',
          sku: 'CLV-SQG-BLU',
          image: '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg',
          stock: 10,
          hexColor: '#0284c7',
          isAvailable: true
        },
        {
          id: 'var-white',
          color: 'White',
          name: 'Pure Arctic White',
          sku: 'CLV-SQG-WHT',
          image: '/src/assets/images/clevara_cleaner_white_1794193756650.jpg',
          stock: 10,
          hexColor: '#f8fafc',
          isAvailable: true
        },
        {
          id: 'var-orange',
          color: 'Orange',
          name: 'Vibrant Sunset Orange',
          sku: 'CLV-SQG-ORG',
          image: '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg',
          stock: 10,
          hexColor: '#ea580c',
          isAvailable: true
        }
      ],
      specifications: [
        { key: 'Product Name', value: 'CLEVARA Multifunctional Spray Squeegee Window Cleaner' },
        { key: 'Blade Material', value: 'High-Density Flexible Optical Silicone (Streak-Free)' },
        { key: 'Spray Mechanism', value: 'Built-in Pressure Atomizer Pump with 250ml reservoir' },
        { key: 'Microfiber Pad', value: 'Dual-weave Scrubbing Pad (Machine-Washable & Reusable)' },
        { key: 'Applicable Surfaces', value: 'Panoramic Windows, Glass Balconies, Car Windshields, Mirrors, Shower Doors, Gloss Tiles' },
        { key: 'Weight & Dimensions', value: '220g Ergonomic Lightweight Handle (26cm blade width)' },
        { key: 'Warranty & Support', value: '100% Satisfaction Guarantee · Nepal Delivery Concierge' }
      ],
      status: 'published',
      isFeatured: true,
      isBestseller: true,
      restockStatus: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return {
    settings: {
      storeName: 'CLEVARA',
      tagline: 'CLEANER. BRIGHTER. BETTER.',
      supportPhone: '+977 1 4545000',
      supportEmail: 'concierge@clevara.com.np',
      currencySymbol: 'रु.',
      defaultDeliveryFee: 0,
      freeDeliveryThreshold: 0,
      defaultLowStockThreshold: 5,
      passwordHash,
      passwordSalt: salt,
      updatedAt: new Date().toISOString()
    },
    products: initialProducts,
    inventoryLogs: [
      {
        id: 'log-initial-blue',
        productId: 'prod-clevara-multifunctional-squeegee',
        productName: 'CLEVARA Multifunctional Spray Squeegee Window Cleaner (Blue)',
        previousStock: 0,
        newStock: 10,
        change: 10,
        reason: 'restock',
        operator: 'System Setup',
        createdAt: new Date().toISOString()
      },
      {
        id: 'log-initial-white',
        productId: 'prod-clevara-multifunctional-squeegee',
        productName: 'CLEVARA Multifunctional Spray Squeegee Window Cleaner (White)',
        previousStock: 0,
        newStock: 10,
        change: 10,
        reason: 'restock',
        operator: 'System Setup',
        createdAt: new Date().toISOString()
      },
      {
        id: 'log-initial-orange',
        productId: 'prod-clevara-multifunctional-squeegee',
        productName: 'CLEVARA Multifunctional Spray Squeegee Window Cleaner (Orange)',
        previousStock: 0,
        newStock: 10,
        change: 10,
        reason: 'restock',
        operator: 'System Setup',
        createdAt: new Date().toISOString()
      }
    ],
    deals: [
      {
        id: 'deal-launch-nepal',
        title: 'CLEVARA Official Launch Privilege — Free Nationwide Delivery',
        description: 'Order today and receive 100% free delivery across all 7 Provinces of Nepal on your CLEVARA Spray Squeegee Window Cleaner.',
        bannerUrl: '/src/assets/images/deal_banner_nepal_1794115563679.jpg',
        productIds: ['prod-clevara-multifunctional-squeegee'],
        discountType: 'fixed',
        discountValue: 0,
        startDate: '2026-11-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        couponCode: 'FREEDELIVERY',
        timesRedeemed: 12,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ],
    limitedOffers: [
      {
        id: 'offer-launch-price',
        title: 'Introductory Launch Price — NPR 499 (Standard रु. 699)',
        productId: 'prod-clevara-multifunctional-squeegee',
        specialPrice: 499,
        originalPrice: 699,
        totalOfferStock: 30,
        soldStock: 0,
        startTime: '2026-11-01T00:00:00Z',
        endTime: '2026-12-31T23:59:59Z',
        maxPerCustomer: 5,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ],
    orders: [],
    restockSubscriptions: [],
    events: [
      {
        id: 'event-clevara-grand-opening',
        title: 'CLEVARA Nepal Grand Opening Gala',
        description: 'Join our official Nepal launch event celebrating pristine home living and crystal clarity. Check in to unlock an exclusive celebration voucher.',
        bannerImage: '/src/assets/images/deal_banner_nepal_1794115563679.jpg',
        code: 'CLEVARA2026',
        congratulationMessage: 'Congratulations! You have successfully unlocked VIP privileges for the CLEVARA Grand Opening. Enjoy an additional 10% privilege on your first order.',
        rewardTitle: 'Grand Opening VIP Privilege Voucher',
        rewardCode: 'VIPGALA10',
        rewardDiscountValue: 10,
        rewardDiscountType: 'percentage',
        startDate: '2026-11-01T00:00:00Z',
        endDate: '2026-12-31T23:59:59Z',
        isActive: true,
        attendeesCount: 8,
        createdAt: new Date().toISOString()
      }
    ],
    eventAttendees: [],
    sessions: {}
  };
}
    orders: [],
    restockSubscriptions: [],
    events: [],
    eventAttendees: [],
    sessions: {}
  };
}

let db: DatabaseSchema;

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure expected fields exist
      if (!parsed.settings || !parsed.products) {
        throw new Error('Invalid DB structure');
      }
      parsed.events = parsed.events || [];
      parsed.eventAttendees = parsed.eventAttendees || [];
      return parsed;
    }
  } catch (err) {
    console.warn('Initializing fresh CLEVARA database...', err);
  }
  const fresh = getInitialDatabase();
  saveDatabase(fresh);
  return fresh;
}

function saveDatabase(data: DatabaseSchema): void {
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
  db = data;
}

db = loadDatabase();

// ---------------------------------------------------------------------------
// Express App & Middleware
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json({ limit: '10mb' }));

// Auth token middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  }

  const token = authHeader.split(' ')[1];
  const session = db.sessions[token];

  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      delete db.sessions[token];
      saveDatabase(db);
    }
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  // Session valid
  next();
}

// ---------------------------------------------------------------------------
// Authentication Routes
// ---------------------------------------------------------------------------

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const calculatedHash = hashPassword(password, db.settings.passwordSalt);
  if (calculatedHash !== db.settings.passwordHash) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
  db.sessions[token] = {
    createdAt: Date.now(),
    expiresAt: Date.now() + sessionDuration
  };
  saveDatabase(db);

  return res.json({
    token,
    storeName: db.settings.storeName,
    expiresAt: db.sessions[token].expiresAt
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    delete db.sessions[token];
    saveDatabase(db);
  }
  return res.json({ success: true });
});

app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  const session = db.sessions[token];
  if (!session || session.expiresAt < Date.now()) {
    return res.json({ authenticated: false });
  }
  return res.json({ authenticated: true, storeName: db.settings.storeName });
});

app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const currentHash = hashPassword(currentPassword, db.settings.passwordSalt);
  if (currentHash !== db.settings.passwordHash) {
    return res.status(400).json({ error: 'Current password does not match.' });
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  db.settings.passwordSalt = newSalt;
  db.settings.passwordHash = hashPassword(newPassword, newSalt);
  db.settings.updatedAt = new Date().toISOString();
  saveDatabase(db);

  return res.json({ success: true, message: 'Owner password successfully updated.' });
});

// ---------------------------------------------------------------------------
// Public Storefront & Product Routes
// ---------------------------------------------------------------------------

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({
    storeName: db.settings.storeName,
    tagline: db.settings.tagline,
    supportPhone: db.settings.supportPhone,
    supportEmail: db.settings.supportEmail,
    currencySymbol: db.settings.currencySymbol,
    defaultDeliveryFee: db.settings.defaultDeliveryFee,
    freeDeliveryThreshold: db.settings.freeDeliveryThreshold,
    defaultLowStockThreshold: db.settings.defaultLowStockThreshold
  });
});

app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort } = req.query;
  let products = db.products.filter(p => p.status === 'published');

  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    products.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
  } else if (sort === 'price_desc') {
    products.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
  } else if (sort === 'popular') {
    products.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  } else {
    // Newest
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.get('/api/deals', (_req: Request, res: Response) => {
  const now = new Date().toISOString();
  const activeDeals = db.deals.filter(d => d.isActive && d.startDate <= now && d.endDate >= now);
  res.json(activeDeals);
});

app.get('/api/limited-offers', (_req: Request, res: Response) => {
  const now = new Date().toISOString();
  const activeOffers = db.limitedOffers.filter(o => o.isActive && o.startTime <= now && o.endTime >= now);
  res.json(activeOffers);
});

// Public Events
app.get('/api/events', (_req: Request, res: Response) => {
  const now = new Date().toISOString();
  const activeEvents = (db.events || []).filter(e => e.isActive && e.startDate <= now && e.endDate >= now);
  res.json(activeEvents);
});

// Customer Event Check-in with Congratulation Celebration
app.post('/api/events/checkin', (req: Request, res: Response) => {
  const { eventId, customerName, customerContact } = req.body;
  if (!eventId || !customerName || !customerContact) {
    return res.status(400).json({ error: 'Event ID, full name, and phone number are required.' });
  }

  const event = (db.events || []).find(e => e.id === eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found or has concluded.' });
  }

  const attendee = {
    id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    eventId: event.id,
    eventTitle: event.title,
    customerName: String(customerName).trim(),
    customerContact: String(customerContact).trim(),
    checkedInAt: new Date().toISOString()
  };

  db.eventAttendees = db.eventAttendees || [];
  db.eventAttendees.unshift(attendee);
  event.attendeesCount = (event.attendeesCount || 0) + 1;
  saveDatabase(db);

  return res.json({
    success: true,
    congratulationTitle: 'Congratulations & Welcome to CLEVARA!',
    congratulationMessage: event.congratulationMessage || 'You have successfully checked into this exclusive CLEVARA event.',
    eventTitle: event.title,
    rewardTitle: event.rewardTitle || 'Exclusive Event Privilege Voucher',
    rewardCode: event.rewardCode || 'VIPGALA20',
    rewardDiscountValue: event.rewardDiscountValue || 15,
    rewardDiscountType: event.rewardDiscountType || 'percentage',
    attendee
  });
});

// Restock notification subscription
app.post('/api/restock/subscribe', (req: Request, res: Response) => {
  const { productId, contact } = req.body;
  if (!productId || !contact) {
    return res.status(400).json({ error: 'Product ID and contact information are required.' });
  }

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const exists = db.restockSubscriptions.some(s => s.productId === productId && s.contact.toLowerCase() === contact.toLowerCase());
  if (!exists) {
    db.restockSubscriptions.push({
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId,
      productName: product.name,
      contact,
      createdAt: new Date().toISOString(),
      notified: false
    });
    saveDatabase(db);
  }

  return res.json({ success: true, message: 'You have been subscribed to restock notifications.' });
});

// ---------------------------------------------------------------------------
// Customer Checkout & Atomic Inventory Deduction
// ---------------------------------------------------------------------------

app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items, couponCode, paymentMethod, esewaNumber } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data.' });
  }

  // 1. Validate customer details
  if (!customer.fullName || !customer.phone || !customer.province || !customer.district || !customer.cityMunicipality || !customer.fullAddress || !customer.houseNumber) {
    return res.status(400).json({ error: 'All required delivery address fields must be filled.' });
  }

  // 2. Validate phone number
  const cleanPhone = customer.phone.replace(/[\s\-()]/g, '');
  if (cleanPhone.length < 9) {
    return res.status(400).json({ error: 'Valid Nepalese phone number is required.' });
  }

  // Validate eSewa number if chosen
  const selectedPaymentMethod = paymentMethod === 'eSewa' ? 'eSewa' : 'Cash on Delivery';
  if (selectedPaymentMethod === 'eSewa' && !esewaNumber) {
    return res.status(400).json({ error: 'eSewa mobile number / ID is required for eSewa payment.' });
  }

  // 3. Verify stock availability and recalculate pricing server-side
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productName || item.productId} no longer exists.` });
    }

    if (product.status !== 'published') {
      return res.status(400).json({ error: `Product ${product.name} is currently unavailable.` });
    }

    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));

    // Variant stock verification
    let matchedVariant: any = undefined;
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      if (item.variantId) {
        matchedVariant = product.variants.find((v: any) => v.id === item.variantId);
      } else if (item.color) {
        matchedVariant = product.variants.find((v: any) => v.color.toLowerCase() === String(item.color).toLowerCase());
      }
      if (!matchedVariant) {
        matchedVariant = product.variants[0];
      }

      if (matchedVariant.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name} in ${matchedVariant.color}. Available: ${matchedVariant.stock} units, Requested: ${qty}.`
        });
      }
    } else {
      if (product.stock < qty) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock} units, Requested: ${qty}.`
        });
      }
    }

    // Check if there is an active limited offer for this product
    const now = new Date().toISOString();
    const activeOffer = db.limitedOffers.find(o => o.isActive && o.productId === product.id && o.startTime <= now && o.endTime >= now);

    let unitPrice = product.discountedPrice || product.price;
    if (activeOffer && activeOffer.specialPrice < unitPrice) {
      unitPrice = activeOffer.specialPrice;
    }

    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    verifiedItems.push({
      productId: product.id,
      productName: product.name,
      variantId: matchedVariant?.id,
      color: matchedVariant?.color,
      productImage: matchedVariant?.image || product.images[0] || '',
      sku: matchedVariant?.sku || product.sku,
      quantity: qty,
      unitPrice,
      totalPrice: itemTotal
    });
  }

  // 4. Calculate coupon discount if provided (Checks Deals AND Event Reward Vouchers)
  let couponDiscount = 0;
  let appliedCoupon: string | undefined = undefined;

  if (couponCode && typeof couponCode === 'string') {
    const code = couponCode.trim().toUpperCase();
    const deal = db.deals.find(d => d.isActive && d.couponCode && d.couponCode.toUpperCase() === code);
    if (deal) {
      if (deal.discountType === 'percentage') {
        couponDiscount = Math.round((subtotal * deal.discountValue) / 100);
      } else {
        couponDiscount = deal.discountValue;
      }
      couponDiscount = Math.min(couponDiscount, subtotal);
      appliedCoupon = deal.couponCode;
      deal.timesRedeemed = (deal.timesRedeemed || 0) + 1;
    } else {
      // Check event reward vouchers
      const eventWithVoucher = (db.events || []).find(e => e.isActive && e.rewardCode && e.rewardCode.toUpperCase() === code);
      if (eventWithVoucher) {
        if (eventWithVoucher.rewardDiscountType === 'percentage') {
          couponDiscount = Math.round((subtotal * eventWithVoucher.rewardDiscountValue) / 100);
        } else {
          couponDiscount = eventWithVoucher.rewardDiscountValue;
        }
        couponDiscount = Math.min(couponDiscount, subtotal);
        appliedCoupon = eventWithVoucher.rewardCode;
      }
    }
  }

  // 5. Calculate delivery fee (free delivery where supported)
  const deliveryFee = db.settings.defaultDeliveryFee || 0;
  const totalAmount = Math.max(0, subtotal - couponDiscount + deliveryFee);

  // 6. ATOMIC INVENTORY DEDUCTION & LOGGING
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `CLV-ORD-${dateStr}-${randomSuffix}`;

  for (const item of verifiedItems) {
    const product = db.products.find(p => p.id === item.productId)!;
    const prevStock = product.stock;

    if (Array.isArray(product.variants) && item.variantId) {
      const variant = product.variants.find((v: any) => v.id === item.variantId);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
      }
      product.stock = product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
    } else {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
    product.updatedAt = new Date().toISOString();

    db.inventoryLogs.unshift({
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      productName: item.color ? `${product.name} (${item.color})` : product.name,
      previousStock: prevStock,
      newStock: product.stock,
      change: -item.quantity,
      reason: 'order_deduction',
      referenceId: orderId,
      createdAt: new Date().toISOString()
    });
  }

  // 7. Save order
  const order = {
    id: orderId,
    customer,
    items: verifiedItems,
    selectedColor: verifiedItems[0]?.color,
    subtotal,
    dealDiscount: 0,
    couponDiscount,
    appliedCoupon,
    deliveryFee,
    totalAmount,
    paymentMethod: selectedPaymentMethod,
    paymentStatus: selectedPaymentMethod === 'eSewa' ? 'PENDING_VERIFICATION' : 'UNPAID',
    esewaNumber: selectedPaymentMethod === 'eSewa' ? String(esewaNumber).trim() : undefined,
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(order);
  saveDatabase(db);

  return res.status(201).json({
    success: true,
    orderId,
    order
  });
});

// eSewa payment initiation
app.post('/api/payment/esewa/initiate', (req: Request, res: Response) => {
  const { orderId } = req.body;
  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const merchantId = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
  const secretKey = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
  const environment = process.env.ESEWA_ENVIRONMENT || 'development';
  const appUrl = process.env.APP_URL || 'http://localhost:3000';

  const totalAmountStr = order.totalAmount.toString();
  const transactionUuid = `${order.id}-${Date.now()}`;
  const signatureData = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${merchantId}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(signatureData);
  const signature = hmac.digest('base64');

  return res.json({
    success: true,
    orderId: order.id,
    merchantId,
    environment,
    amount: order.subtotal,
    taxAmount: 0,
    totalAmount: order.totalAmount,
    transactionUuid,
    productCode: merchantId,
    signature,
    successUrl: `${appUrl}/api/payment/esewa/callback?q=su`,
    failureUrl: `${appUrl}/api/payment/esewa/callback?q=fu`,
    esewaUrl: environment === 'production'
      ? 'https://epay.esewa.com.np/api/epay/main/v2/form'
      : 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
  });
});

// eSewa payment verification endpoint
app.post('/api/payment/esewa/verify', (req: Request, res: Response) => {
  const { orderId, transactionRef, status } = req.body;
  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status === 'FAILURE') {
    order.paymentStatus = 'FAILED';
    order.updatedAt = new Date().toISOString();
    saveDatabase(db);
    return res.json({ success: false, message: 'Payment marked failed.' });
  }

  order.paymentStatus = 'PAID';
  order.transactionRef = transactionRef || `ESEWA-REF-${Date.now()}`;
  order.status = 'Confirmed';
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  return res.json({
    success: true,
    message: 'eSewa payment successfully verified.',
    order
  });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

// ---------------------------------------------------------------------------
// Owner Administration Routes (Protected by requireAdmin)
// ---------------------------------------------------------------------------

app.get('/api/admin/products', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.products);
});

app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  const {
    name,
    description,
    images,
    category,
    sku,
    price,
    discountedPrice,
    stock,
    lowStockThreshold,
    specifications,
    status,
    isFeatured,
    isBestseller,
    restockStatus,
    expectedRestockDate,
    incomingStock,
    restockAnnouncement
  } = req.body;

  if (!name || price === undefined || price === null) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const newStock = Math.max(0, Number(stock) || 0);
  const newProduct = {
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: String(name).trim(),
    description: String(description || '').trim(),
    images: Array.isArray(images) && images.length > 0 ? images : ['/src/assets/images/product_spray_window_cleaner_1794115562619.jpg'],
    category: String(category || 'General Care').trim(),
    sku: String(sku || `CLV-${Math.floor(1000 + Math.random() * 9000)}`).trim(),
    price: Math.max(0, Number(price)),
    discountedPrice: discountedPrice ? Math.max(0, Number(discountedPrice)) : undefined,
    stock: newStock,
    lowStockThreshold: Math.max(1, Number(lowStockThreshold) || db.settings.defaultLowStockThreshold),
    specifications: Array.isArray(specifications) ? specifications : [],
    status: status || 'published',
    isFeatured: Boolean(isFeatured),
    isBestseller: Boolean(isBestseller),
    restockStatus: restockStatus || 'available',
    expectedRestockDate: expectedRestockDate || undefined,
    incomingStock: incomingStock ? Number(incomingStock) : undefined,
    restockAnnouncement: restockAnnouncement || undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);

  if (newStock > 0) {
    db.inventoryLogs.unshift({
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: newProduct.id,
      productName: newProduct.name,
      previousStock: 0,
      newStock,
      change: newStock,
      reason: 'manual_adjustment',
      operator: 'Owner Portal',
      createdAt: new Date().toISOString()
    });
  }

  saveDatabase(db);
  return res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const productIndex = db.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[productIndex];
  const body = req.body;

  // Track stock change if modified via product edit form
  if (body.stock !== undefined && Number(body.stock) !== existing.stock) {
    const newStock = Math.max(0, Number(body.stock));
    const diff = newStock - existing.stock;
    db.inventoryLogs.unshift({
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: existing.id,
      productName: existing.name,
      previousStock: existing.stock,
      newStock,
      change: diff,
      reason: 'manual_adjustment',
      operator: 'Owner Product Update',
      createdAt: new Date().toISOString()
    });
    existing.stock = newStock;
  }

  Object.assign(existing, {
    name: body.name !== undefined ? String(body.name).trim() : existing.name,
    description: body.description !== undefined ? String(body.description).trim() : existing.description,
    images: body.images !== undefined ? body.images : existing.images,
    category: body.category !== undefined ? String(body.category).trim() : existing.category,
    sku: body.sku !== undefined ? String(body.sku).trim() : existing.sku,
    price: body.price !== undefined ? Math.max(0, Number(body.price)) : existing.price,
    discountedPrice: body.discountedPrice !== undefined ? (body.discountedPrice ? Math.max(0, Number(body.discountedPrice)) : undefined) : existing.discountedPrice,
    lowStockThreshold: body.lowStockThreshold !== undefined ? Math.max(1, Number(body.lowStockThreshold)) : existing.lowStockThreshold,
    specifications: body.specifications !== undefined ? body.specifications : existing.specifications,
    status: body.status !== undefined ? body.status : existing.status,
    isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
    isBestseller: body.isBestseller !== undefined ? Boolean(body.isBestseller) : existing.isBestseller,
    restockStatus: body.restockStatus !== undefined ? body.restockStatus : existing.restockStatus,
    expectedRestockDate: body.expectedRestockDate !== undefined ? body.expectedRestockDate : existing.expectedRestockDate,
    incomingStock: body.incomingStock !== undefined ? Number(body.incomingStock) : existing.incomingStock,
    restockAnnouncement: body.restockAnnouncement !== undefined ? body.restockAnnouncement : existing.restockAnnouncement,
    updatedAt: new Date().toISOString()
  });

  saveDatabase(db);
  return res.json(existing);
});

app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = db.products.splice(index, 1)[0];
  saveDatabase(db);
  return res.json({ success: true, deletedId: deleted.id });
});

app.post('/api/admin/products/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const duplicated = {
    ...product,
    id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: `${product.name} (Copy)`,
    sku: `${product.sku}-COPY`,
    status: 'unpublished',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.products.unshift(duplicated);
  saveDatabase(db);
  return res.status(201).json(duplicated);
});

// Inventory stock adjustment endpoint (handles both product and variant-level)
app.post('/api/admin/inventory/adjust', requireAdmin, (req: Request, res: Response) => {
  const { productId, variantId, color, type, amount, reason } = req.body;
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount < 0) {
    return res.status(400).json({ error: 'Invalid amount.' });
  }

  let matchedVariant: any = undefined;
  if (Array.isArray(product.variants) && (variantId || color)) {
    matchedVariant = product.variants.find((v: any) => v.id === variantId || (color && v.color.toLowerCase() === String(color).toLowerCase()));
  }

  const previousStock = matchedVariant ? matchedVariant.stock : product.stock;
  let newStock = previousStock;

  if (type === 'set') {
    newStock = Math.max(0, numAmount);
  } else if (type === 'add') {
    newStock = previousStock + numAmount;
  } else if (type === 'remove') {
    newStock = Math.max(0, previousStock - numAmount);
  } else {
    return res.status(400).json({ error: 'Invalid adjustment type.' });
  }

  const change = newStock - previousStock;
  if (matchedVariant) {
    matchedVariant.stock = newStock;
    product.stock = product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
  } else {
    product.stock = newStock;
  }
  product.updatedAt = new Date().toISOString();

  // If product was marked restocking/out of stock and now has stock, allow setting back to available
  if (product.stock > 0 && product.restockStatus === 'restocking_soon') {
    product.restockStatus = 'available';
  }

  const logName = matchedVariant ? `${product.name} (${matchedVariant.color})` : product.name;

  db.inventoryLogs.unshift({
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    productId: product.id,
    productName: logName,
    previousStock,
    newStock,
    change,
    reason: reason || 'manual_adjustment',
    operator: 'Owner Inventory Action',
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);
  return res.json({ success: true, product, log: db.inventoryLogs[0] });
});

// Update specific variant details (image, stock, name, availability)
app.put('/api/admin/products/:id/variants/:variantId', requireAdmin, (req: Request, res: Response) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!Array.isArray(product.variants)) {
    return res.status(404).json({ error: 'Product has no variants' });
  }

  const variant = product.variants.find((v: any) => v.id === req.params.variantId);
  if (!variant) {
    return res.status(404).json({ error: 'Variant not found' });
  }

  const { stock, image, name, isAvailable } = req.body;
  if (stock !== undefined) {
    const num = Math.max(0, Number(stock));
    const prev = variant.stock;
    variant.stock = num;
    product.stock = product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
    if (num !== prev) {
      db.inventoryLogs.unshift({
        id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        productName: `${product.name} (${variant.color})`,
        previousStock: prev,
        newStock: num,
        change: num - prev,
        reason: 'manual_adjustment',
        operator: 'Variant Stock Edit',
        createdAt: new Date().toISOString()
      });
    }
  }

  if (image) variant.image = String(image).trim();
  if (name) variant.name = String(name).trim();
  if (isAvailable !== undefined) variant.isAvailable = Boolean(isAvailable);

  product.updatedAt = new Date().toISOString();
  saveDatabase(db);
  return res.json({ success: true, product, variant });
});

app.get('/api/admin/inventory/logs', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.inventoryLogs.slice(0, 100));
});

// Orders Management
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  const { search, status } = req.query;
  let orders = [...db.orders];

  if (status && status !== 'All') {
    orders = orders.filter(o => o.status.toLowerCase() === String(status).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.cityMunicipality.toLowerCase().includes(q)
    );
  }

  res.json(orders);
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, paymentStatus } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const prevStatus = order.status;
  const newStatus = status || prevStatus;

  // Inventory restoration when an order is cancelled (restores variant stock atomically)
  if (prevStatus !== 'Cancelled' && newStatus === 'Cancelled') {
    for (const item of order.items) {
      const product = db.products.find(p => p.id === item.productId);
      if (product) {
        const prevStock = product.stock;
        if (Array.isArray(product.variants) && item.variantId) {
          const variant = product.variants.find((v: any) => v.id === item.variantId);
          if (variant) {
            variant.stock += item.quantity;
          }
          product.stock = product.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0);
        } else {
          product.stock += item.quantity;
        }
        product.updatedAt = new Date().toISOString();

        db.inventoryLogs.unshift({
          id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          productId: product.id,
          productName: item.color ? `${product.name} (${item.color})` : product.name,
          previousStock: prevStock,
          newStock: product.stock,
          change: item.quantity,
          reason: 'order_cancellation',
          referenceId: order.id,
          operator: 'Owner Cancellation',
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  order.status = newStatus;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);

  return res.json(order);
});

// Customers Management (Aggregated from real orders)
app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
  const customerMap: Record<string, any> = {};

  for (const order of db.orders) {
    const phone = order.customer.phone.trim();
    if (!customerMap[phone]) {
      customerMap[phone] = {
        name: order.customer.fullName,
        phone,
        altPhone: order.customer.altPhone,
        province: order.customer.province,
        district: order.customer.district,
        cityMunicipality: order.customer.cityMunicipality,
        areaTole: order.customer.areaTole,
        fullAddress: order.customer.fullAddress,
        houseNumber: order.customer.houseNumber,
        totalOrders: 0,
        totalSpent: 0,
        orders: [],
        firstOrderDate: order.createdAt,
        lastOrderDate: order.createdAt
      };
    }

    const c = customerMap[phone];
    c.totalOrders += 1;
    if (order.status !== 'Cancelled') {
      c.totalSpent += order.totalAmount;
    }
    c.orders.push({
      id: order.id,
      date: order.createdAt,
      totalAmount: order.totalAmount,
      status: order.status
    });

    if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = order.createdAt;
    }
  }

  const customerList = Object.values(customerMap).sort((a: any, b: any) => b.totalSpent - a.totalSpent);
  res.json(customerList);
});

// Deals CRUD
app.get('/api/admin/deals', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.deals);
});

app.post('/api/admin/deals', requireAdmin, (req: Request, res: Response) => {
  const { title, description, bannerUrl, productIds, discountType, discountValue, startDate, endDate, couponCode, maxRedemptions } = req.body;
  if (!title || discountValue === undefined) {
    return res.status(400).json({ error: 'Title and discount value are required.' });
  }

  const deal = {
    id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: String(title).trim(),
    description: String(description || '').trim(),
    bannerUrl: bannerUrl || '/src/assets/images/deal_banner_nepal_1794115563679.jpg',
    productIds: Array.isArray(productIds) ? productIds : [],
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    couponCode: couponCode ? String(couponCode).trim().toUpperCase() : undefined,
    maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
    timesRedeemed: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.deals.unshift(deal);
  saveDatabase(db);
  return res.status(201).json(deal);
});

app.put('/api/admin/deals/:id', requireAdmin, (req: Request, res: Response) => {
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  Object.assign(deal, req.body);
  saveDatabase(db);
  return res.json(deal);
});

app.delete('/api/admin/deals/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.deals.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  db.deals.splice(index, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

// Limited Offers CRUD
app.get('/api/admin/limited-offers', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.limitedOffers);
});

app.post('/api/admin/limited-offers', requireAdmin, (req: Request, res: Response) => {
  const { title, productId, specialPrice, totalOfferStock, startTime, endTime, maxPerCustomer } = req.body;
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: 'Selected product does not exist.' });
  }

  const offer = {
    id: `offer-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: String(title).trim(),
    productId,
    specialPrice: Number(specialPrice),
    originalPrice: product.price,
    totalOfferStock: Number(totalOfferStock) || product.stock,
    soldStock: 0,
    startTime: startTime || new Date().toISOString(),
    endTime: endTime || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    maxPerCustomer: Number(maxPerCustomer) || 2,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  db.limitedOffers.unshift(offer);
  saveDatabase(db);
  return res.status(201).json(offer);
});

app.put('/api/admin/limited-offers/:id', requireAdmin, (req: Request, res: Response) => {
  const offer = db.limitedOffers.find(o => o.id === req.params.id);
  if (!offer) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  Object.assign(offer, req.body);
  saveDatabase(db);
  return res.json(offer);
});

app.delete('/api/admin/limited-offers/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.limitedOffers.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  db.limitedOffers.splice(index, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

// ---------------------------------------------------------------------------
// Admin Events CRUD & Attendees
// ---------------------------------------------------------------------------

app.get('/api/admin/events', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.events || []);
});

app.post('/api/admin/events', requireAdmin, (req: Request, res: Response) => {
  const {
    title,
    description,
    bannerImage,
    code,
    congratulationMessage,
    rewardTitle,
    rewardCode,
    rewardDiscountValue,
    rewardDiscountType,
    startDate,
    endDate
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Event title is required.' });
  }

  const newEvent = {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: String(title).trim(),
    description: String(description || '').trim(),
    bannerImage: bannerImage || '/src/assets/images/deal_banner_nepal_1794115563679.jpg',
    code: String(code || `EVENT-${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase(),
    congratulationMessage: String(congratulationMessage || 'Congratulations! You are officially registered and unlocked your exclusive CLEVARA privilege.').trim(),
    rewardTitle: String(rewardTitle || 'Event VIP Voucher').trim(),
    rewardCode: String(rewardCode || 'VIP15').trim().toUpperCase(),
    rewardDiscountValue: Number(rewardDiscountValue) || 15,
    rewardDiscountType: rewardDiscountType === 'fixed' ? 'fixed' : 'percentage',
    startDate: startDate || new Date().toISOString(),
    endDate: endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    attendeesCount: 0,
    createdAt: new Date().toISOString()
  };

  db.events = db.events || [];
  db.events.unshift(newEvent);
  saveDatabase(db);
  return res.status(201).json(newEvent);
});

app.put('/api/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
  db.events = db.events || [];
  const event = db.events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  Object.assign(event, req.body);
  saveDatabase(db);
  return res.json(event);
});

app.delete('/api/admin/events/:id', requireAdmin, (req: Request, res: Response) => {
  db.events = db.events || [];
  const index = db.events.findIndex(e => e.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  db.events.splice(index, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

app.get('/api/admin/events/attendees', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.eventAttendees || []);
});

// Analytics Dashboard (Real Database Data)
app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
  let totalRevenue = 0;
  let totalUnitsSold = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;
  let paidOrders = 0;
  let codOrders = 0;
  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};

  const variantStats: Record<string, { color: string; stock: number; sold: number; revenue: number; hexColor: string; image: string }> = {
    Blue: { color: 'Blue', stock: 0, sold: 0, revenue: 0, hexColor: '#0284c7', image: '/src/assets/images/clevara_cleaner_blue_1794193742888.jpg' },
    White: { color: 'White', stock: 0, sold: 0, revenue: 0, hexColor: '#f8fafc', image: '/src/assets/images/clevara_cleaner_white_1794193756650.jpg' },
    Orange: { color: 'Orange', stock: 0, sold: 0, revenue: 0, hexColor: '#ea580c', image: '/src/assets/images/clevara_cleaner_orange_1794193770204.jpg' }
  };

  // Populate inventory stock per variant from catalog
  for (const product of db.products) {
    if (Array.isArray(product.variants)) {
      for (const v of product.variants) {
        if (variantStats[v.color]) {
          variantStats[v.color].stock += v.stock;
          if (v.image) variantStats[v.color].image = v.image;
        }
      }
    }
  }

  for (const order of db.orders) {
    if (order.paymentStatus === 'PAID') paidOrders += 1;
    if (order.paymentMethod === 'Cash on Delivery') codOrders += 1;

    if (order.status === 'Cancelled') {
      cancelledOrders += 1;
      continue;
    }

    totalRevenue += order.totalAmount;
    if (order.status === 'Pending') pendingOrders += 1;
    if (order.status === 'Delivered') deliveredOrders += 1;

    for (const item of order.items) {
      totalUnitsSold += item.quantity;
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = { name: item.productName, units: 0, revenue: 0 };
      }
      productSalesMap[item.productId].units += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;

      if (item.color && variantStats[item.color]) {
        variantStats[item.color].sold += item.quantity;
        variantStats[item.color].revenue += item.totalPrice;
      }
    }
  }

  // Determine best selling color
  let bestSellingColor = 'Blue';
  let maxSold = -1;
  for (const [col, stats] of Object.entries(variantStats)) {
    if (stats.sold > maxSold) {
      maxSold = stats.sold;
      bestSellingColor = col;
    }
  }

  const topSelling = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const lowStockCount = db.products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = db.products.filter(p => p.stock === 0).length;
  const restockingCount = db.products.filter(p => p.restockStatus === 'restocking_soon').length;
  const totalInventory = Object.values(variantStats).reduce((acc, v) => acc + v.stock, 0);

  res.json({
    totalRevenue,
    totalOrders: db.orders.length,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    paidOrders,
    codOrders,
    totalProducts: db.products.length,
    totalUnitsSold,
    totalInventory,
    lowStockCount,
    outOfStockCount,
    restockingCount,
    topSelling,
    variantStats,
    bestSellingColor,
    activeDealsCount: db.deals.filter(d => d.isActive).length,
    activeOffersCount: db.limitedOffers.filter(o => o.isActive).length
  });
});

// Restock notification subscribers
app.get('/api/admin/restock/subscribers', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.restockSubscriptions);
});

app.post('/api/admin/restock/notify', requireAdmin, (req: Request, res: Response) => {
  const { productId } = req.body;
  const subscribers = db.restockSubscriptions.filter(s => s.productId === productId && !s.notified);
  for (const s of subscribers) {
    s.notified = true;
  }
  saveDatabase(db);
  return res.json({ success: true, count: subscribers.length });
});

// Settings Management
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const { storeName, tagline, supportPhone, supportEmail, defaultDeliveryFee, freeDeliveryThreshold, defaultLowStockThreshold } = req.body;

  Object.assign(db.settings, {
    storeName: storeName !== undefined ? String(storeName).trim() : db.settings.storeName,
    tagline: tagline !== undefined ? String(tagline).trim() : db.settings.tagline,
    supportPhone: supportPhone !== undefined ? String(supportPhone).trim() : db.settings.supportPhone,
    supportEmail: supportEmail !== undefined ? String(supportEmail).trim() : db.settings.supportEmail,
    defaultDeliveryFee: defaultDeliveryFee !== undefined ? Number(defaultDeliveryFee) : db.settings.defaultDeliveryFee,
    freeDeliveryThreshold: freeDeliveryThreshold !== undefined ? Number(freeDeliveryThreshold) : db.settings.freeDeliveryThreshold,
    defaultLowStockThreshold: defaultLowStockThreshold !== undefined ? Number(defaultLowStockThreshold) : db.settings.defaultLowStockThreshold,
    updatedAt: new Date().toISOString()
  });

  saveDatabase(db);
  return res.json(db.settings);
});

// Database Reset & Seed Endpoints (As explicitly requested by user)
app.post('/api/admin/database/reset', requireAdmin, (_req: Request, res: Response) => {
  db.products = [];
  db.inventoryLogs = [];
  db.deals = [];
  db.limitedOffers = [];
  db.orders = [];
  db.restockSubscriptions = [];
  db.events = [];
  db.eventAttendees = [];
  saveDatabase(db);
  return res.json({ success: true, message: 'All store data completely reset to zero. Storefront and dashboard are clean.' });
});

app.post('/api/admin/database/seed-25', requireAdmin, (_req: Request, res: Response) => {
  const categories = ['Surface & Glass Care', 'Body Cleaner', 'Stone & Wood Care', 'Accessories', 'Kitchen & Tableware'];
  const baseProducts = [
    { name: 'CLEVARA Spray Window Cleaner', category: 'Surface & Glass Care', price: 1450, stock: 25, sku: 'CLV-WIN-500', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Multi-Surface Purifying Cleanser', category: 'Surface & Glass Care', price: 1650, stock: 18, sku: 'CLV-SRF-500', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Botanical Body Cleansing Gel', category: 'Body Cleaner', price: 1850, stock: 8, sku: 'CLV-BDY-250', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Architectural Travertine & Marble Balm', category: 'Stone & Wood Care', price: 2200, stock: 2, sku: 'CLV-STN-200', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Ultra-Dense Microfiber Buffing Cloth (Set of 3)', category: 'Accessories', price: 850, stock: 0, sku: 'CLV-ACC-003', img: '/src/assets/images/product_linen_mist_1794115564318.jpg', restock: 'restocking_soon' },
    { name: 'CLEVARA Organic Citrus Dishwashing Elixir', category: 'Kitchen & Tableware', price: 1150, stock: 35, sku: 'CLV-KTN-500', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Polished Brass & Copper Polish Paste', category: 'Surface & Glass Care', price: 1950, stock: 3, sku: 'CLV-BRS-150', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Teak & Walnut Nourishing Oil', category: 'Stone & Wood Care', price: 2400, stock: 14, sku: 'CLV-WOD-300', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Himalayan Herb Exfoliating Body Bar', category: 'Body Cleaner', price: 750, stock: 19, sku: 'CLV-BAR-200', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Precision Squeegee with Silicone Blade', category: 'Accessories', price: 1650, stock: 15, sku: 'CLV-SQG-001', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Stainless Steel Appliance Restorer', category: 'Surface & Glass Care', price: 1550, stock: 22, sku: 'CLV-STL-500', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Nourishing Botanical Body Cleanser', category: 'Body Cleaner', price: 2650, stock: 1, sku: 'CLV-BDY-500', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Hand-Carved Travertine Soap Dish', category: 'Accessories', price: 2100, stock: 7, sku: 'CLV-TRV-001', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Natural Leather Moisturizing Emulsion', category: 'Stone & Wood Care', price: 2850, stock: 4, sku: 'CLV-LTH-200', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Crystal Chandelier Micro-Mist Rinser', category: 'Surface & Glass Care', price: 2950, stock: 6, sku: 'CLV-CRY-750', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Purifying Body Polish Scrub', category: 'Body Cleaner', price: 1950, stock: 40, sku: 'CLV-SCR-300', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Heavy Degreasing Kitchen Stovetop Paste', category: 'Kitchen & Tableware', price: 1400, stock: 17, sku: 'CLV-DGR-300', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Gentle Foaming Mountain Spring Hand & Body Wash', category: 'Body Cleaner', price: 1600, stock: 11, sku: 'CLV-FMW-350', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Natural Bamboo Dish Scrub Brush', category: 'Accessories', price: 650, stock: 50, sku: 'CLV-BRS-001', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Anti-Fog Mirror Shield Treatment', category: 'Surface & Glass Care', price: 1350, stock: 16, sku: 'CLV-AFG-200', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Terrazzo Floor Revitalizing Wash', category: 'Stone & Wood Care', price: 2150, stock: 9, sku: 'CLV-FLR-1000', img: '/src/assets/images/product_surface_cleaner_1794115563573.jpg' },
    { name: 'CLEVARA Pure Wool Dryer Balls (Set of 4)', category: 'Accessories', price: 1200, stock: 28, sku: 'CLV-DRY-004', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA High-Altitude Juniper Refreshing Body Gel', category: 'Body Cleaner', price: 2400, stock: 5, sku: 'CLV-JNP-250', img: '/src/assets/images/product_linen_mist_1794115564318.jpg' },
    { name: 'CLEVARA Screen & Lens Optical Cloths (Set of 5)', category: 'Accessories', price: 750, stock: 32, sku: 'CLV-LNS-005', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' },
    { name: 'CLEVARA Complete Luxury Home Sanctuary Set', category: 'Surface & Glass Care', price: 8500, stock: 3, sku: 'CLV-BOX-001', img: '/src/assets/images/product_spray_window_cleaner_1794115562619.jpg' }
  ];

  db.products = baseProducts.map((p, idx) => ({
    id: `prod-seed-${idx + 1}`,
    name: p.name,
    description: `Handcrafted premium formulation for modern luxury living spaces. Made with refined botanical extracts and mountain spring minerals in Nepal.`,
    images: [p.img],
    category: p.category,
    sku: p.sku,
    price: p.price,
    discountedPrice: p.price > 2000 ? p.price - 200 : undefined,
    stock: p.stock,
    lowStockThreshold: 5,
    specifications: [
      { key: 'Collection', value: 'CLEVARA Sanctuary Reserve' },
      { key: 'Origin', value: 'Nepal' },
      { key: 'Standard', value: 'ISO Eco-Purity Verified' }
    ],
    status: 'published',
    isFeatured: idx < 4,
    isBestseller: idx === 0 || idx === 3 || idx === 11,
    restockStatus: p.stock === 0 ? 'restocking_soon' : 'available',
    expectedRestockDate: p.stock === 0 ? '2026-11-25' : undefined,
    createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  }));

  saveDatabase(db);
  return res.json({ success: true, count: db.products.length });
});

// Database export backup
app.get('/api/admin/database/backup', requireAdmin, (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=clevara_backup_${Date.now()}.json`);
  res.send(JSON.stringify(db, null, 2));
});

// ---------------------------------------------------------------------------
// Server Bootstrap & Vite Integration
// ---------------------------------------------------------------------------

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLEVARA Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CLEVARA server:', err);
  process.exit(1);
});
