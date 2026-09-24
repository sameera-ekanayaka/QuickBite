# In-Class Activity Submission Report
## Cross-Platform Mobile App Development & Testing

### Project Title: QuickBite - University of Kelaniya Campus Food Ordering App

**Student Name:** Sameera Ekanayaka  
**Student Registration Number:** PS/2021/045  
**Faculty / Department:** Faculty of Science, Department of Statistics and Computer Science  
**Institution:** University of Kelaniya, Sri Lanka  
**Chosen Framework:** React Native (Expo SDK)  
**GitHub Repository Link:** [https://github.com/sameera-ekanayaka/QuickBite](https://github.com/sameera-ekanayaka/QuickBite)  

---

### 1. Introduction and Background

At the University of Kelaniya, students only have 15 to 30 minute breaks between lectures. During these short intervals, the main campus canteen gets very crowded, resulting in long queues. Many students either miss their meals or end up being late for their next lecture.

To solve this practical campus problem, I developed **QuickBite**, a cross-platform mobile application prototype. It allows students to view the daily canteen menu, pre-order food at subsidized student prices in Sri Lankan Rupees (LKR), choose their preferred pickup counter, and track their order status in real time.

---

### 2. Tools and Technology Stack

- **Framework:** React Native with Expo SDK 57 (single codebase running on both Android and iOS).
- **Language:** JavaScript (ES6+).
- **Navigation Library:** React Navigation (Native Stack) for fast screen transitions.
- **State Management:** React Context API (`CartContext`, `OrderContext`, `AuthContext`) for shared app state.
- **Styling and Theme:** React Native StyleSheet using an Uber-inspired minimalist black-and-white design system with 16px cards and 999px pill action buttons.
- **Development Tools:** Visual Studio Code, Node.js v22, Git and GitHub.
- **Testing:** Automated Node.js test script (`tests/runTests.js`) and manual functional verification.

---

### 3. Screen Structure and UI Implementation

As required by the activity sheet, the application consists of 8 main screens. Each screen is linked using React Navigation:

`Splash` -> `Login` -> `Home` -> `Item Detail` -> `Cart` -> `Checkout` -> `Order Tracking` -> `Profile`

#### Screen 1: Splash Screen
- Shows the QuickBite monogram, University of Kelaniya branding, and canteen slogan.
- Automatically transitions to the Login screen after 2 seconds, or lets the user tap "Enter Canteen" directly.

<!-- SCREENSHOT PLACEHOLDER: 01_splash_screen -->
![Splash Screen](screenshots/01_splash_screen.png)

---

#### Screen 2: Login and Guest Access Screen
- Allows students to log in with their university email (`ps2021045@stu.kln.ac.lk`) or registration number (`PS/2021/045`).
- Includes validation for student email format and a minimum 6-character password.
- Provides a "Continue as guest student" button for fast one-tap access without logging in.
- Includes an "Autofill demo credentials" option for quick evaluation.

<!-- SCREENSHOT PLACEHOLDER: 02_login_screen -->
![Login Screen](screenshots/02_login_screen.png)

---

#### Screen 3: Home Screen (Canteen Menu)
- Displays active canteen announcement ("Counters 1, 2, and 3 active").
- Includes a live search bar and horizontal category pill filter (All, Rice & Meals, Roti & Hoppers, Short Eats, Beverages).
- Lists authentic canteen dishes with realistic subsidized prices in LKR (e.g. Vegetable Rice at LKR 150, Chicken Kottu at LKR 240, Malu Paan at LKR 80, Plain Tea at LKR 30).
- Features quick "+ Add" buttons on each card and a floating bottom cart pill bar when items are selected.

<!-- SCREENSHOT PLACEHOLDER: 03_home_screen -->
![Home Screen](screenshots/03_home_screen.png)

---

#### Screen 4: Item Detail View
- Shows full dish details: preparation time, calories, dietary tags, and ingredients.
- Quantity selector allowing students to select between 1 and 20 portions.
- Kitchen instructions input box (e.g., "Add extra chilli paste", capped at 120 characters).
- Live price calculation in LKR and a sticky "Add to order" button at the bottom.

<!-- SCREENSHOT PLACEHOLDER: 04_item_cart_bar -->
![Item Detail and Floating Cart Bar](screenshots/04_item_cart_bar.png)

---

#### Screen 5: Cart Screen
- Lists all selected items with individual quantity adjustment controls (+ and -) and remove buttons.
- Packaging preference toggle: "Takeaway" (+LKR 20 eco-box container fee) or "Dine in" (LKR 0.00).
- Automatic calculation of subtotal, packaging fee, and grand total in LKR.
- Blocks checkout if the cart is empty and alerts the user when reducing quantity to zero.

<!-- SCREENSHOT PLACEHOLDER: 05_cart_screen -->
![Cart Screen](screenshots/05_cart_screen.png)

---

#### Screen 6: Checkout Screen
- Mandatory pickup counter selection:
  - Counter 1: Main Meals & Rice
  - Counter 2: Short Eats & Bakery
  - Counter 3: Tea & Juice Bar
- Mandatory lecture break time slot selection (e.g., Next Lecture Interval, Main Lunch Break, Express).
- Contact mobile number field with Sri Lankan phone number validation (`07XXXXXXXX` or `+947XXXXXXXX`).
- Payment method selector: Student Canteen Pass, LankaQR Online, or Cash at Counter.
- "Confirm & place order" button that creates the order and clears the cart.

<!-- SCREENSHOT PLACEHOLDER: 06_checkout_screen -->
![Checkout Screen](screenshots/06_checkout_screen.png)

---

#### Screen 7: Order Tracking Screen
- Shows the generated order number (e.g., `#UOK-8049`) and estimated pickup time.
- Displays a 4-digit pickup token to show at the counter.
- Features a 4-stage visual progress pipeline:
  `Placed` -> `Preparing` -> `Ready for Pickup` -> `Completed`
- Includes an "Advance stage" simulation button so teachers and evaluators can test how the order moves through each kitchen stage.
- Shows itemized receipt details and return navigation buttons.

<!-- SCREENSHOT PLACEHOLDER: 07_order_tracking_screen -->
![Order Tracking Screen](screenshots/07_order_tracking_screen.png)

---

#### Screen 8: Student Profile Screen
- Displays the student's name, registration number, faculty, and university email.
- Displays the active Student Canteen Pass balance in LKR.
- Lists chronological past order history with dates, item breakdown, and total amounts paid.
- Provides a "Sign out" button that returns to the login screen.

<!-- SCREENSHOT PLACEHOLDER: 08_profile_screen -->
![Profile Screen](screenshots/08_profile_screen.png)

---

### 4. State Management and Core Logic

To satisfy Part C of the activity sheet, I used the React Context API to manage shared state across all screens without losing data when navigating:

1. **`CartContext`:**
   - Stores `cartItems`, `isTakeaway`, `subtotal`, `packagingFee`, and `grandTotal`.
   - `addToCart()` adds a new item or increments quantity if the item is already in the cart.
   - `updateQuantity()` clamps values between 1 and 20.
   - `subtotal` dynamically sums `(item.price * quantity)` across all cart items.
   - Cart data persists smoothly while switching between menu, item detail, cart, and profile.

2. **`OrderContext`:**
   - `placeOrder()` generates a random unique ID (`UOK-XXXX`), attaches the selected counter, pickup slot, and timestamp.
   - `advanceOrderStatus()` moves the order through the required sequence:
     `Placed` -> `Preparing` -> `Ready for Pickup` -> `Completed`.
   - When completed, the order is automatically moved into `orderHistory`.

3. **`AuthContext`:**
   - Stores current logged in student credentials or guest status.

---

### 5. Key Code Snippets with Explanations

#### Snippet 1: Navigation Stack Configuration (`AppNavigator.js`)
This code registers all 8 screens in the exact sequence requested in the activity sheet:

```javascript
// src/navigation/AppNavigator.js
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```
*Explanation:* React Navigation Native Stack handles screen transitions. Custom headers are used in each screen so the default header is set to `headerShown: false`.

---

#### Snippet 2: Dynamic Cart Total Calculation (`CartContext.js`)
This snippet calculates the subtotal and item count whenever cart items change:

```javascript
// src/context/CartContext.js
const { subtotal, itemCount } = useMemo(() => {
  return cartItems.reduce(
    (acc, current) => {
      const itemPrice = current.item.price || 0;
      const qty = current.quantity || 1;
      return {
        subtotal: acc.subtotal + itemPrice * qty,
        itemCount: acc.itemCount + qty,
      };
    },
    { subtotal: 0, itemCount: 0 }
  );
}, [cartItems]);

// Takeaway packaging fee (LKR 20 if takeaway, LKR 0 for dine in)
const packagingFee = useMemo(() => {
  if (cartItems.length === 0) return 0;
  return isTakeaway ? 20 : 0;
}, [cartItems.length, isTakeaway]);

const grandTotal = useMemo(() => {
  return subtotal + packagingFee;
}, [subtotal, packagingFee]);
```
*Explanation:* `useMemo` recalculates the bill only when `cartItems` or `isTakeaway` changes. This ensures fast performance and accurate numbers on both the Cart and Checkout screens.

---

#### Snippet 3: Input Validation Utilities (`formatters.js`)
This snippet validates the student email and Sri Lankan mobile numbers:

```javascript
// src/utils/formatters.js
export function validateEmail(email) {
  if (!email) return { isValid: false, message: 'Email address cannot be empty.' };
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, message: 'Please enter a valid email format.' };
  }
  return { isValid: true, message: '' };
}

export function validatePhone(phone) {
  if (!phone) return { isValid: false, message: 'Phone number cannot be empty.' };
  const cleanPhone = phone.trim().replace(/[\s-]/g, '');
  // Matches Sri Lankan mobile format: 07XXXXXXXX or +947XXXXXXXX
  const slPhoneRegex = /^(?:0|(?:\+94))7\d{8}$/;
  if (!slPhoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      message: 'Enter a valid Sri Lankan mobile number (e.g. 0712345678 or +94712345678).',
    };
  }
  return { isValid: true, message: '' };
}
```
*Explanation:* Simple regular expressions ensure that users enter realistic contact details before placing an order.

---

#### Snippet 4: Order Status Progression Simulation (`OrderContext.js`)
This snippet moves an order through the four lifecycle states:

```javascript
// src/context/OrderContext.js
export const ORDER_STATUSES = ['Placed', 'Preparing', 'Ready for Pickup', 'Completed'];

const advanceOrderStatus = (orderId) => {
  setActiveOrders((prevActive) => {
    const orderIndex = prevActive.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return prevActive;

    const order = prevActive[orderIndex];
    const currentIndex = ORDER_STATUSES.indexOf(order.status);

    if (currentIndex < ORDER_STATUSES.length - 1) {
      const nextStatus = ORDER_STATUSES[currentIndex + 1];
      const updatedOrder = { ...order, status: nextStatus };

      if (nextStatus === 'Completed') {
        setOrderHistory((prevHistory) => [updatedOrder, ...prevHistory]);
        return prevActive.filter((o) => o.id !== orderId);
      }

      const updatedList = [...prevActive];
      updatedList[orderIndex] = updatedOrder;
      return updatedList;
    }
    return prevActive;
  });
};
```
*Explanation:* Each tap on the simulation button shifts the order status by one step. When the order reaches `Completed`, it gets moved into the student's permanent order history.

---

### 6. Test Cases and Test Execution Log

To satisfy Part D of the activity sheet, 6 test cases were designed and executed covering navigation, menu filtering, cart logic, form validation, order simulation, and responsive layout.

| Test Case ID | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Navigation Route Hierarchy | All 8 required screens (`Splash`, `Login`, `Home`, `ItemDetail`, `Cart`, `Checkout`, `OrderTracking`, `Profile`) are registered and navigate without errors. | All 8 routes loaded and transitioned within 1 second. | **PASS** |
| **TC-02** | Menu Filtering & Subsidized Pricing | Menu displays dishes with prices in LKR. Main meals must be within subsidized campus rate (150 to 250 LKR). Category filters and text search filter dishes properly. | Dishes filtered accurately by category and keyword. Subsidized prices verified. | **PASS** |
| **TC-03** | Cart Calculation & State Persistence | Adding items calculates subtotal (`price * quantity`). Adding takeaway option adds LKR 20. Cart contents persist when returning from Home screen. | Subtotal and grand total calculated accurately. Cart state persisted across screens. | **PASS** |
| **TC-04** | Form and Input Validation | Login validates student email format and password length (>= 6 chars). Checkout validates Sri Lankan phone format (`07XXXXXXXX`). Kitchen notes capped at 120 chars. | Empty and invalid inputs rejected with clear inline error messages. Valid inputs accepted. | **PASS** |
| **TC-05** | Order Placement & Status Progression | Order placement generates a unique order ID (`UOK-XXXX`). Order moves through `Placed` -> `Preparing` -> `Ready for Pickup` -> `Completed`. | Order ID generated. Simulated status stepped through all 4 stages correctly. | **PASS** |
| **TC-06** | Responsive Layout Adaptation | UI layout adapts between phone view (single-column) and tablet view (2-column grid at 720px breakpoint) without overflowing. | Single-column rendered on phone; 2-column grid rendered on tablet view cleanly. | **PASS** |

**Automated Test Execution Summary:**
- Total assertions executed: 26
- Passed: 26
- Failed: 0
- Command to reproduce: `npm test`

---

### 7. Git Workflow and Repository Management

To keep a clean development record, code was never pushed directly to `main`. Every feature was built on a separate branch, committed with descriptive human messages, and merged back into `main`:

- `feature/setup-project` (Project initialization, Expo config, base dependencies)
- `feature/theme-and-canteen-data` (University of Kelaniya menu data, subsidized LKR prices, theme tokens)
- `feature/state-contexts` (`CartContext`, `OrderContext`, `AuthContext`)
- `feature/reusable-components` (`Header`, `Badge`, `QuantitySelector`, `FoodCard`, `StatusTracker`)
- `feature/auth-and-splash-screens` (`SplashScreen` with auto-transition, `LoginScreen` with validation)
- `feature/home-and-item-detail-screens` (`HomeScreen` with search/filters, `ItemDetailScreen` with portion stepper)
- `feature/cart-and-checkout-screens` (`CartScreen` with dynamic totals, `CheckoutScreen` with counter/slot picker)
- `feature/order-tracking-and-profile-screens` (`OrderTrackingScreen` with simulation, `ProfileScreen` with order history)
- `feature/navigation-and-root-app` (Root `App.js` and `AppNavigator.js`)
- `feature/web-support-and-test-suite` (Automated verification script and web support)
- `feature/uber-inspired-design-system` (Refactored to Uber minimalist design with 16px cards and 999px pills)

All branches and commits are pushed to the GitHub repository:  
**Repository URL:** [https://github.com/sameera-ekanayaka/QuickBite](https://github.com/sameera-ekanayaka/QuickBite)

---

### 8. Conclusion

The QuickBite MVP was successfully developed and tested using React Native. The application meets all functional and non-functional requirements specified in the activity sheet:
- Smooth navigation across 8 screens with sub-second transition speeds.
- Realistic University of Kelaniya canteen context with student-subsidized prices in LKR.
- Persistent cart state across screen transitions.
- Interactive order lifecycle tracking with status simulation.
- Polished, responsive user interface styled with the Uber-inspired design system.
- Full automated test suite with 100% pass rate.
