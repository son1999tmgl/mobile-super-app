import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InTraceProps } from '../../types';
import { useProductSelect } from './useProductSelect';
import { styles } from './ProductSelect.styles';

interface Props extends InTraceProps {
  navigation: any;
  onProductSelected?: (product: any) => void;
  apiBaseUrl?: string;
}

export const ProductSelectScreen: React.FC<Props> = ({
  navigation,
  token,
  environment,
  userInfo,
  onProductSelected,
  apiBaseUrl,
}) => {
  const insets = useSafeAreaInsets();
  const {
    products,
    totalCount,
    searchTerm,
    setSearchTerm,
    loading,
    refreshing,
    selectedProduct,
    onRefresh,
    handleSelectProduct,
  } = useProductSelect(token, environment, navigation, onProductSelected, apiBaseUrl, userInfo);

  return (
    <View style={styles.container}>
      {/* Header chọn sản phẩm */}
      <View style={[styles.headerBox, { paddingTop: Math.max(insets.top, 16) }]}>
        <Text style={styles.headerTitle}>Chọn Sản Phẩm</Text>
        <Text style={styles.headerSub}>
          Hệ thống yêu cầu chọn sản phẩm trước khi thao tác đóng thùng &amp; xếp công
        </Text>

        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, mã sản phẩm hoặc GTIN..."
            placeholderTextColor="#64748B"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Danh sách sản phẩm */}
      <ScrollView
        contentContainerStyle={styles.contentList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionTitle}>
          Danh mục sản phẩm doanh nghiệp ({totalCount})
        </Text>

        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#0284C7" />
            <Text style={[styles.emptyDesc, { marginTop: 12 }]}>
              Đang tải danh mục sản phẩm từ máy chủ inTrace...
            </Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm nào</Text>
            <Text style={styles.emptyDesc}>
              {searchTerm
                ? `Không có sản phẩm nào khớp với từ khóa "${searchTerm}".`
                : 'Tài khoản doanh nghiệp chưa khai báo danh mục sản phẩm nào trên hệ thống inTrace.'}
            </Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.8}>
              <Text style={styles.refreshBtnText}>Tải lại dữ liệu ↻</Text>
            </TouchableOpacity>
          </View>
        ) : (
          products.map((item) => {
            const isSelected = selectedProduct?.id === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.productCard, isSelected && styles.productCardSelected]}
                onPress={() => handleSelectProduct(item)}
                activeOpacity={0.8}
              >
                <View style={styles.cardMainContent}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.productThumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.productIconBox}>
                      <Text style={styles.productIconEmoji}>📦</Text>
                    </View>
                  )}

                  <View style={styles.productDetails}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      {isSelected ? (
                        <View style={[styles.productBadge, { backgroundColor: '#E0F2FE', borderColor: '#7DD3FC' }]}>
                          <Text style={[styles.productBadgeText, { color: '#0369A1' }]}>ĐANG CHỌN</Text>
                        </View>
                      ) : item.is_boxing ? (
                        <View style={styles.productBadge}>
                          <Text style={styles.productBadgeText}>CÓ ĐÓNG THÙNG</Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.productMetaRow}>
                      {item.code ? (
                        <Text style={styles.metaItem}>
                          Mã: <Text style={styles.metaValue}>{item.code}</Text>
                        </Text>
                      ) : null}
                      {item.gtin_code ? (
                        <Text style={styles.metaItem}>
                          GTIN: <Text style={styles.metaValue}>{item.gtin_code}</Text>
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Text style={styles.actionText}>
                    {isSelected ? 'Tiếp tục với sản phẩm này' : 'Chọn sản phẩm này để đóng thùng'}
                  </Text>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

