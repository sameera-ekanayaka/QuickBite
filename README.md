# QuickBite - Campus Food Ordering App

QuickBite is a cross-platform mobile application designed for the University of Kelaniya campus canteen. It enables university students and staff to browse daily canteen menus, pre-order meals ahead of time, select designated campus pickup counters, and monitor order preparation status in real time to avoid long cafeteria queues between lectures.

## Key Features
- University student email and Student ID authentication with guest access fallback.
- Categorized canteen menu with realistic subsidized prices in Sri Lankan Rupees (LKR).
- Real-time search and filter by category (Rice & Meals, Roti & Traditional, Short Eats, Beverages).
- Interactive food item detail view with portion customization, quantity modifier, and kitchen notes.
- Cart management with dynamic subtotal, container fee, and grand total calculations.
- Checkout flow with selection of University of Kelaniya pickup counters and lecture break pickup slots.
- Live multi-stage order tracking (Order Placed -> Preparing -> Ready for Pickup -> Completed) with simulation controls.
- Student profile view with past order history and re-ordering options.
- Responsive layout supporting both mobile phones and tablets.

## Tech Stack
- Framework: React Native with Expo
- Navigation: React Navigation (Native Stack)
- State Management: React Context API (CartContext, OrderContext, AuthContext)
- Target Platforms: Android and iOS
