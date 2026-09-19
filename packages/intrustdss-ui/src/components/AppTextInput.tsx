import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { colors, radius, spacing, typography } from '../tokens';

export interface AppTextInputProps extends TextInputProps {
  label?: string;
  hint?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  required?: boolean;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  hint,
  errorMessage,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  required = false,
  onFocus,
  onBlur,
  style,
  placeholderTextColor = colors.textMuted,
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required ? <Text style={styles.requiredMark}> *</Text> : null}
        </View>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          hasError && styles.inputError,
          style as ViewStyle,
        ]}
      >
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}

        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...restProps}
        />

        {rightIcon ? (
          onRightIconPress ? (
            <TouchableOpacity
              onPress={onRightIconPress}
              activeOpacity={0.7}
              style={styles.rightIconWrapper}
            >
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIconWrapper}>{rightIcon}</View>
          )
        ) : null}
      </View>

      {hasError ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  requiredMark: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    paddingVertical: spacing.sm + 2,
  },
  leftIconWrapper: {
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconWrapper: {
    marginLeft: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeight.medium,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
  },
});
