import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context providers for global persistent state
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';

// Central navigation stack
import AppNavigator from './src/navigation/AppNavigator';

// Root App component for QuickBite campus food ordering app.
// Connects authentication, persistent cart state, order tracking context,
// and screen navigation for University of Kelaniya canteen.
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppNavigator />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
