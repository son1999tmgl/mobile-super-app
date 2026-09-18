import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  userInfo?: { name?: string };
  environment?: string;
  onExit?: () => void;
}

export const EContractHomeScreen: React.FC<Props> = ({ userInfo, environment, onExit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>eContract • Hợp đồng điện tử</Text>
          <Text style={styles.sub}>{userInfo?.name || 'Người dùng'} - Môi trường: {environment?.toUpperCase()}</Text>
        </View>
        {onExit ? (
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>Thoát ✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Ký kết số an toàn & Bảo mật</Text>
          <Text style={styles.bannerSub}>Hỗ trợ chứng thư số VNPT CA, Viettel CA, SmartCA</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>✍️</Text>
            <Text style={styles.cardTitle}>Chờ tôi ký</Text>
            <Text style={styles.cardCount}>3 tài liệu</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>⏳</Text>
            <Text style={styles.cardTitle}>Chờ đối tác</Text>
            <Text style={styles.cardCount}>1 tài liệu</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>✅</Text>
            <Text style={styles.cardTitle}>Hoàn thành</Text>
            <Text style={styles.cardCount}>12 tài liệu</Text>
          </View>
        </View>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Module eContract đang sẵn sàng tiếp nhận các luồng nghiệp vụ chi tiết từ team eContract.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#1E1B4B',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#818CF8', fontSize: 17, fontWeight: '700' },
  sub: { color: '#C7D2FE', fontSize: 12, marginTop: 2 },
  exitBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  exitBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { padding: 16 },
  banner: { backgroundColor: '#4F46E5', borderRadius: 12, padding: 16, marginBottom: 16 },
  bannerTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: '#E0E7FF', fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cardEmoji: { fontSize: 24, marginBottom: 4 },
  cardTitle: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  cardCount: { fontSize: 15, color: '#0F172A', fontWeight: '700', marginTop: 2 },
  placeholderBox: { backgroundColor: '#EEF2FF', borderRadius: 8, padding: 16, borderLeftWidth: 4, borderLeftColor: '#4F46E5' },
  placeholderText: { color: '#3730A3', fontSize: 13, lineHeight: 18 },
});
