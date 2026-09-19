import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        style,
      ]}
    >
      {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
      <Text style={[styles.textBase, styles[`text_${variant}`], styles[`textSize_${size}`]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.full,
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  textBase: {
    fontWeight: typography.fontWeight.semiBold,
  },

  // Variants
  success: {
    backgroundColor: colors.successLight,
  },
  warning: {
    backgroundColor: colors.warningLight,
  },
  error: {
    backgroundColor: colors.errorLight,
  },
  info: {
    backgroundColor: colors.infoLight,
  },
  neutral: {
    backgroundColor: colors.surfaceSubtle,
  },

  // Text colors
  text_success: {
    color: colors.successText,
  },
  text_warning: {
    color: colors.warningText,
  },
  text_error: {
    color: colors.errorText,
  },
  text_info: {
    color: colors.infoText,
  },
  text_neutral: {
    color: colors.textSecondary,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  size_md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  textSize_sm: {
    fontSize: typography.fontSize.xs,
  },
  textSize_md: {
    fontSize: typography.fontSize.sm,
  },
});
