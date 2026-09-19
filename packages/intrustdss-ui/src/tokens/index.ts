export const colors = {
  primary: '#1E40AF',
  primaryDark: '#1E3A8A',
  primaryLight: '#DBEAFE',
  secondary: '#0EA5E9',
  secondaryLight: '#E0F2FE',
  
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  borderFocus: '#2563EB',
  
  success: '#10B981',
  successLight: '#D1FAE5',
  successText: '#065F46',
  
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningText: '#92400E',
  
  error: '#EF4444',
  errorLight: '#FEE2E2',
  errorText: '#991B1B',
  
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  infoText: '#1E40AF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    display: 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
} as const;
