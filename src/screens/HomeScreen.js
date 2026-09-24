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
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';
import { MENU_CATEGORIES, MENU_ITEMS, CANTEEN_INFO } from '../constants/canteenData';
import { formatLKR, sanitizeSearchQuery } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import FoodCard from '../components/FoodCard';

// Uber-Inspired Home Screen for QuickBite campus food ordering app.
// Styled with horizontal category chips (999px pills with polarity flip),
// canvas-soft search input, and a signature black floating cart pill bar.
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
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesSearch =
        !cleanSearch ||
        item.name.toLowerCase().includes(cleanSearch) ||
        item.description.toLowerCase().includes(cleanSearch) ||
        item.ingredients.toLowerCase().includes(cleanSearch) ||
        item.counter.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleItemPress = (item) => {
    navigation.navigate('ItemDetail', { item });
  };

  const handleQuickAdd = (item) => {
    addToCart(item, 1, '');
    setFeedbackToast(`Added 1x ${item.name} to order`);
    setTimeout(() => {
      setFeedbackToast('');
    }, 1800);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <Header
        title="QuickBite"
        subtitle={CANTEEN_INFO.name}
        showBack={false}
        navigation={navigation}
      />

      {/* Canteen announcement strip */}
      <View style={styles.announcementStrip}>
        <View style={styles.statusIndicator} />
        <Text style={styles.announcementText} numberOfLines={1}>
          Open: Counters 1, 2, and 3 active for student pickup
        </Text>
      </View>

      {/* Search Input in canvas-soft row */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search kottu, rice, rolls, tea, juice..."
            placeholderTextColor={COLORS.mute}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchPill}
              accessibilityLabel="Clear search input"
            >
              <Text style={styles.clearSearchText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Horizontal Category Pill Row */}
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
        key={numColumns}
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
              Showing {filteredItems.length} subsidized items
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find anything matching "{searchQuery}".
            </Text>
            <TouchableOpacity style={styles.resetPill} onPress={resetFilters}>
              <Text style={styles.resetPillText}>View all menu items</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Floating Bottom Cart Pill Bar */}
      {itemCount > 0 && (
        <View style={styles.floatingCartBar}>
          <View style={styles.cartInfoSection}>
            <View style={styles.cartCounterPill}>
              <Text style={styles.cartCounterText}>{itemCount}</Text>
            </View>
            <View>
              <Text style={styles.cartSubtotalLabel}>Subtotal</Text>
              <Text style={styles.cartSubtotalValue}>{formatLKR(subtotal)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewCartPill}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.85}
            accessibilityLabel="Proceed to view cart"
          >
            <Text style={styles.viewCartPillText}>View cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.canvas,
  },
  announcementStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.canvasSoft,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.ink,
    marginRight: SPACING.sm,
  },
  announcementText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.ink,
    fontWeight: FONTS.weights.medium,
  },
  searchSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.canvas,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.canvasSoft,
    borderRadius: RADIUS.pill, // 999px pill search bar
    paddingHorizontal: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONTS.sizes.sm,
    color: COLORS.ink,
  },
  clearSearchPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearSearchText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
    fontWeight: FONTS.weights.semibold,
  },
  categoriesContainer: {
    backgroundColor: COLORS.canvas,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
  },
  categoryListContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill, // 999px pill
    backgroundColor: COLORS.canvasSoft,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary, // Polarity flip to solid black
  },
  categoryPillText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.ink,
  },
  categoryPillTextSelected: {
    color: COLORS.onPrimary,
    fontWeight: FONTS.weights.bold,
  },
  toastContainer: {
    backgroundColor: COLORS.blackElevated,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
  },
  toastText: {
    color: COLORS.onDark,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
  resultsHeader: {
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  resultsCount: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.mute,
  },
  menuListContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 95,
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
    color: COLORS.ink,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.mute,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resetPill: {
    backgroundColor: COLORS.canvasSoft,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.pill,
  },
  resetPillText: {
    color: COLORS.ink,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.blackElevated, // Polarity flip dark band
    borderRadius: RADIUS.pill, // Signature 999px floating pill
    paddingVertical: SPACING.sm,
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cartCounterPill: {
    backgroundColor: COLORS.canvas,
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCounterText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  cartSubtotalLabel: {
    fontSize: 9,
    color: COLORS.mute,
    textTransform: 'uppercase',
  },
  cartSubtotalValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.onDark,
  },
  viewCartPill: {
    backgroundColor: COLORS.canvas, // White pill CTA on black band
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: RADIUS.pill, // 999px pill
  },
  viewCartPillText: {
    color: COLORS.ink,
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
});
