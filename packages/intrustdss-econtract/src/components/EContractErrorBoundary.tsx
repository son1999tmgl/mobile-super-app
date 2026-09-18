import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: React.ReactNode;
  onExit?: () => void;
}

interface State {
  hasError: boolean;
}

export class EContractErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[eContract Error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Lỗi hệ thống Hợp đồng điện tử</Text>
          <Text style={styles.desc}>Tính năng eContract đang bảo trì tạm thời.</Text>
          {this.props.onExit ? (
            <TouchableOpacity style={styles.btn} onPress={this.props.onExit}>
              <Text style={styles.btnText}>Quay về Super App</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  desc: { fontSize: 14, color: '#64748B', marginBottom: 16, textAlign: 'center' },
  btn: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: '#FFF', fontWeight: '600' },
});
