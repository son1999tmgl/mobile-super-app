import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { colors, radius, spacing, typography, shadows } from '../tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isInteractive}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        variant === 'primary' && !disabled && shadows.sm,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textWhite}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.leftIconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.baseText,
              styles[`${variant}Text`],
              styles[`size_${size}_text`],
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon ? <View style={styles.rightIconWrapper}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
  },
  baseText: {
    fontWeight: typography.fontWeight.semiBold,
    textAlign: 'center',
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.error,
  },

  // Text colors
  primaryText: {
    color: colors.textWhite,
  },
  secondaryText: {
    color: colors.textWhite,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  dangerText: {
    color: colors.textWhite,
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: spacing.md - 1,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    paddingVertical: spacing.md + 3,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
  },

  size_sm_text: {
    fontSize: typography.fontSize.sm,
  },
  size_md_text: {
    fontSize: typography.fontSize.md,
  },
  size_lg_text: {
    fontSize: typography.fontSize.lg,
  },

  // Disabled
  disabled: {
    backgroundColor: colors.border,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.textMuted,
  },
});
