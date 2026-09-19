import { useState, useEffect, useCallback } from 'react';
import { ProductCategory } from '../../types/product';
import { InTraceStorageService } from '../../services/intraceStorage';

export function useProductSelect(
  token: string,
  environment: any,
  navigation: any,
  onProductSelected?: (product: ProductCategory) => void,
  apiBaseUrl?: string,
  userInfo?: any
) {
  const [products, setProducts] = useState<ProductCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedProduct, setSelectedProductState] = useState<ProductCategory | null>(null);

  const loadData = useCallback(async () => {
    try {
      InTraceStorageService.setAuth(
        token,
        environment,
        apiBaseUrl,
        userInfo?.tax_code,
        userInfo?.accountId || userInfo?.id
      );
      const [list, currentSelected] = await Promise.all([
        InTraceStorageService.getProductCategories(),
        InTraceStorageService.getSelectedProduct(),
      ]);
      setProducts(list);
      setSelectedProductState(currentSelected);
    } catch (err) {
      console.warn('[useProductSelect] Lỗi nạp danh sách sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  }, [token, environment, apiBaseUrl, userInfo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSelectProduct = async (product: ProductCategory) => {
    setSelectedProductState(product);
    await InTraceStorageService.setSelectedProduct(product);
    if (onProductSelected) {
      onProductSelected(product);
    } else {
      navigation.navigate('InTraceDashboard');
    }
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm (tên hoặc mã sản phẩm hoặc mã GTIN)
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      p.name.toLowerCase().includes(term) ||
      (p.code && p.code.toLowerCase().includes(term)) ||
      (p.gtin_code && p.gtin_code.toLowerCase().includes(term))
    );
  });

  return {
    products: filteredProducts,
    totalCount: products.length,
    searchTerm,
    setSearchTerm,
    loading,
    refreshing,
    selectedProduct,
    onRefresh,
    handleSelectProduct,
  };
}
