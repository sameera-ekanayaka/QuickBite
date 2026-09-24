import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../constants/theme';
import { MENU_CATEGORIES, MENU_ITEMS, CANTEEN_INFO } from '../constants/canteenData';
import { formatLKR, sanitizeSearchQuery } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import FoodCard from '../components/FoodCard';

// Home Screen for QuickBite campus food ordering app.
// Displays menu items by category, search bar, active canteen status,
// and floating cart bar with live item count and LKR totals.
export default function HomeScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const { addToCart, itemCount, subtotal } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackToast, setFeedbackToast] = useState('');

  // Tablet breakpoint for responsive column layout
  const isTablet = width >= 720;
  const numColumns = isTablet ? 2 : 1;

  // Filter menu items by selected category and sanitized search term
  const filteredItems = useMemo(() => {
    const cleanSearch = sanitizeSearchQuery(searchQuery);

    return MENU_ITEMS.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      // Text search match across name, description, ingredients
      const matchesSearch =
        !cleanSearch ||
        item.name.toLowerCase().includes(cleanSearch) ||
        item.description.toLowerCase().includes(cleanSearch) ||
        item.ingredients.toLowerCase().includes(cleanSearch) ||
        item.counter.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Navigate to item detail view
  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { item });
  };

  // Quick add single unit directly from menu card
  const handleQuickAdd = (item) => {
    addToCart(item, 1, '');
    setFeedbackToast(`Added 1x ${item.name} to cart`);
    setTimeout(() => {
      setFeedbackToast('');
    }, 2000);
  };

  // Clear search and category filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="QuickBite Canteen"
        subtitle={CANTEEN_INFO.name}
        showBack={false}
        navigation={navigation}
      />

      {/* Canteen announcement banner */}
      <View style={styles.announcementBanner}>
        <View style={styles.statusIndicator} />
        <Text style={styles.announcementText} numberOfLines={1}>
          Open: Counters 1, 2, and 3 active for student pickup
        </Text>
      </View>

      {/* Search Input Bar with clear action */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search kottu, rice, rolls, milo, faluda..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchButton}
              accessibilityLabel="Clear search input"
            >
              <Text style={styles.clearSearchText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category selection tabs */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={MENU_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(cat) => cat.id}
          contentContainerStyle={styles.categoryListContent}
          renderItem={({ item: category }) => {
            const isSelected = selectedCategory === category.id;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.8}
                accessibilityLabel={`Filter by ${category.label}`}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Feedback Toast Notification */}
      {feedbackToast ? (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{feedbackToast}</Text>
        </View>
      ) : null}

      {/* Main Menu Grid / List */}
      <FlatList
        key={numColumns} // Re-render when switching between phone and tablet column counts
        numColumns={numColumns}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.menuListContent,
          filteredItems.length === 0 && styles.emptyContainer,
        ]}
        columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={isTablet ? styles.tabletCardWrapper : styles.phoneCardWrapper}>
            <FoodCard
              item={item}
              onPress={handleItemPress}
              onQuickAdd={handleQuickAdd}
            />
          </View>
        )}
        ListHeaderComponent={
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              Showing {filteredItems.length} subsidized canteen items
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Food Items Found</Text>
            <Text style={styles.emptySubtitle}>
              We could not find anything matching "{searchQuery}".
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>View All Menu Items</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Bottom Cart Bar */}
      {itemCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View style={styles.cartInfoSection}>
            <View style={styles.cartCounterBadge}>
              <Text style={styles.cartCounterText}>{itemCount} items</Text>
            </View>
            <View style={styles.cartPriceContainer}>
              <Text style={styles.cartSubtotalLabel}>Subtotal</Text>
              <Text style={styles.cartSubtotalValue}>{formatLKR(subtotal)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.85}
            accessibilityLabel="Proceed to view cart"
          >
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
  },
  announcementText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
  },
  clearSearchButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  clearSearchText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  categoriesContainer: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
  },
  categoryListContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  categoryPillTextSelected: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  toastContainer: {
    backgroundColor: COLORS.textPrimary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  resultsHeader: {
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  resultsCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },
  menuListContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 90, // Leave room for floating cart bar
    paddingTop: SPACING.xs,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  phoneCardWrapper: {
    width: '100%',
  },
  tabletCardWrapper: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.huge,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resetButton: {
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cartInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cartCounterBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  cartCounterText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  cartPriceContainer: {
    justifyContent: 'center',
  },
  cartSubtotalLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  cartSubtotalValue: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
  },
  viewCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: RADIUS.md,
  },
  viewCartButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
});
