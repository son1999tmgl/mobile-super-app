import { StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },
  brandBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.brandAccent,
    letterSpacing: 1.5,
  },
  brandSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.xl,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
});
