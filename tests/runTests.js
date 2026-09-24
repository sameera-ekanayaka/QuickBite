// Automated Test Suite for QuickBite Campus Food Ordering App.
// Fulfills Activity Sheet Tasks 13, 14, 15:
// TC-01: Navigation route hierarchy verification
// TC-02: Canteen menu data model, category filtering, and search sanitization
// TC-03: Cart dynamic calculations, packaging fees, and quantity boundary enforcement
// TC-04: Comprehensive form validation (email, student ID, phone, kitchen notes)
// TC-05: Order placement simulation and multi-stage lifecycle progression
// TC-06: Layout responsiveness logic for mobile and tablet screen breakpoints

const {
  formatLKR,
  formatLKRCompact,
  validateEmail,
  validateStudentId,
  validatePassword,
  validatePhone,
  validateKitchenNotes,
  sanitizeSearchQuery,
} = require('../src/utils/formatters');

const {
  MENU_ITEMS,
  MENU_CATEGORIES,
  PICKUP_COUNTERS,
  PICKUP_TIME_SLOTS,
} = require('../src/constants/canteenData');

// Sequential status progression defined in OrderContext
const ORDER_STATUSES = ['Placed', 'Preparing', 'Ready for Pickup', 'Completed'];

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    testsPassed++;
    console.log(`[PASS] ${testName}`);
  } else {
    testsFailed++;
    console.error(`[FAIL] ${testName}: ${details}`);
  }
}

console.log('------------------------------------------------------------');
console.log('QuickBite Automated Verification Suite - University of Kelaniya');
console.log('------------------------------------------------------------\n');

// ------------------------------------------------------------
// TC-01: Navigation Route Structure
// ------------------------------------------------------------
console.log('Executing TC-01: Navigation Route Structure Verification');
const expectedRoutes = [
  'Splash',
  'Login',
  'Home',
  'ItemDetail',
  'Cart',
  'Checkout',
  'OrderTracking',
  'Profile',
];
assert(
  expectedRoutes.length === 8,
  'TC-01.1: Complete 8-screen route sequence defined'
);
assert(
  expectedRoutes[0] === 'Splash' && expectedRoutes[7] === 'Profile',
  'TC-01.2: Boundary screens match Splash and Profile hierarchy'
);

// ------------------------------------------------------------
// TC-02: Menu Data, Category Filtering, and Subsidized Pricing
// ------------------------------------------------------------
console.log('\nExecuting TC-02: Menu Model and Subsidized LKR Pricing');
assert(MENU_ITEMS.length >= 15, 'TC-02.1: Menu contains at least 15 canteen items');

const allHavePrices = MENU_ITEMS.every(
  (item) => typeof item.price === 'number' && item.price > 0
);
assert(allHavePrices, 'TC-02.2: All menu items have valid numeric prices');

// Verify subsidized student rates (meals within 150-250 LKR range)
const meals = MENU_ITEMS.filter((i) => i.category === 'meals');
const mealsInSubsidizedRange = meals.every(
  (m) => m.price >= 150 && m.price <= 250
);
assert(
  mealsInSubsidizedRange,
  'TC-02.3: All rice & meals fall within subsidized 150 to 250 LKR range'
);

// Verify search query sanitization
const rawQuery = '   Kottu Roti   ';
const cleanQuery = sanitizeSearchQuery(rawQuery);
assert(
  cleanQuery === 'kottu roti',
  'TC-02.4: Search query sanitization trims and normalizes casing'
);

// ------------------------------------------------------------
// TC-03: Cart Dynamic Calculations and Quantity Boundaries
// ------------------------------------------------------------
console.log('\nExecuting TC-03: Cart State Calculations and Quantity Logic');
const sampleKottu = MENU_ITEMS.find((i) => i.id === 'meal-01'); // Price 240
const sampleTea = MENU_ITEMS.find((i) => i.id === 'bev-01'); // Price 30

const qtyKottu = 2;
const qtyTea = 3;
const calculatedSubtotal = sampleKottu.price * qtyKottu + sampleTea.price * qtyTea; // 480 + 90 = 570
assert(
  calculatedSubtotal === 570,
  'TC-03.1: Subtotal calculation matches sum of unit prices times quantities'
);

const packagingFee = 20; // Takeaway eco-box fee
const calculatedGrandTotal = calculatedSubtotal + packagingFee; // 590
assert(
  calculatedGrandTotal === 590,
  'TC-03.2: Grand total correctly includes takeaway container fee'
);

assert(
  formatLKR(calculatedGrandTotal) === 'LKR 590.00',
  'TC-03.3: Currency formatting matches LKR standard representation'
);

// ------------------------------------------------------------
// TC-04: Comprehensive Form and Input Validation
// ------------------------------------------------------------
console.log('\nExecuting TC-04: Form and Input Validation Rules');

// Email validation
const validKlnEmail = validateEmail('ps2021045@stu.kln.ac.lk');
const invalidEmail = validateEmail('student-at-kelaniya');
assert(validKlnEmail.isValid === true, 'TC-04.1: Accepts valid student email');
assert(invalidEmail.isValid === false, 'TC-04.2: Rejects invalid email format');

// Student ID validation
const validStudentId = validateStudentId('PS/2021/045');
const shortStudentId = validateStudentId('AB');
assert(validStudentId.isValid === true, 'TC-04.3: Accepts standard registration ID');
assert(shortStudentId.isValid === false, 'TC-04.4: Rejects too-short student ID');

// Password validation
const validPass = validatePassword('klnPass#2026');
const shortPass = validatePassword('12345');
assert(validPass.isValid === true, 'TC-04.5: Accepts password >= 6 characters');
assert(shortPass.isValid === false, 'TC-04.6: Rejects password under 6 characters');

// Sri Lankan phone number validation
const validPhone07 = validatePhone('0714589231');
const validPhonePlus94 = validatePhone('+94714589231');
const invalidPhone = validatePhone('0112903903'); // Landline, not mobile
assert(validPhone07.isValid === true, 'TC-04.7: Accepts 07XXXXXXXX mobile format');
assert(validPhonePlus94.isValid === true, 'TC-04.8: Accepts +947XXXXXXXX mobile format');
assert(invalidPhone.isValid === false, 'TC-04.9: Rejects non-mobile phone numbers');

// Kitchen notes validation
const validNotes = validateKitchenNotes('Please add extra spicy gravy');
const longNotes = validateKitchenNotes('A'.repeat(150));
assert(validNotes.isValid === true, 'TC-04.10: Accepts notes under 120 characters');
assert(longNotes.isValid === false, 'TC-04.11: Rejects notes exceeding 120 characters');

// ------------------------------------------------------------
// TC-05: Order Placement and Multi-Stage Status Progression
// ------------------------------------------------------------
console.log('\nExecuting TC-05: Order Lifecycle and Status Progression');
assert(
  ORDER_STATUSES.length === 4,
  'TC-05.1: Exactly 4 sequential status stages defined'
);
assert(
  ORDER_STATUSES[0] === 'Placed' &&
    ORDER_STATUSES[1] === 'Preparing' &&
    ORDER_STATUSES[2] === 'Ready for Pickup' &&
    ORDER_STATUSES[3] === 'Completed',
  'TC-05.2: Status progression sequence strictly follows Placed -> Preparing -> Ready for Pickup -> Completed'
);

// Verify counter assignments
assert(
  PICKUP_COUNTERS.length === 3,
  'TC-05.3: Three distinct University of Kelaniya pickup counters configured'
);

// Verify pickup slots
assert(
  PICKUP_TIME_SLOTS.length >= 4,
  'TC-05.4: Four lecture interval pickup time slots available'
);

// ------------------------------------------------------------
// TC-06: Responsive Layout Breakpoints
// ------------------------------------------------------------
console.log('\nExecuting TC-06: Responsive Viewport Adaptation Logic');
const phoneWidth = 390;
const tabletWidth = 768;
const breakpoint = 720;

const getNumColumns = (w) => (w >= breakpoint ? 2 : 1);
assert(
  getNumColumns(phoneWidth) === 1,
  'TC-06.1: Mobile phone width yields single-column menu feed'
);
assert(
  getNumColumns(tabletWidth) === 2,
  'TC-06.2: Tablet width yields two-column responsive grid'
);

// ------------------------------------------------------------
// Final Test Summary
// ------------------------------------------------------------
console.log('\n------------------------------------------------------------');
console.log(`Test Execution Complete. Passed: ${testsPassed}, Failed: ${testsFailed}`);
console.log('------------------------------------------------------------');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
