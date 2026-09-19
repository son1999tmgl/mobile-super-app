import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class HostErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Host Super App Fatal Error]:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🛡️</Text>
          <Text style={styles.title}>Hệ thống Super App đang tự phục hồi</Text>
          <Text style={styles.desc}>
            Đã xảy ra lỗi không mong muốn ở tầng ứng dụng tổng. Vui lòng bấm nút bên dưới để tải lại.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={this.handleRestart}>
            <Text style={styles.btnText}>Khởi động lại Super App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 24 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  desc: { color: '#94A3B8', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  btn: { backgroundColor: '#0284C7', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  btnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
