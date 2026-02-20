import { TextInput, StyleSheet, TextInputProps, View, Text } from "react-native";
import { Colors, FontSize, Spacing } from "../constants/theme";

interface AppTextAreaProps extends TextInputProps {
  label?: string;
  maxLength?: number;
}

export default function AppTextArea({
  label,
  style,
  maxLength,
  value = "",
  ...props
}: AppTextAreaProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textSecondary}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {maxLength ? (
        <Text style={styles.charCount}>
          {(value as string).length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: Spacing.md,
    fontSize: FontSize.lg,
    color: Colors.text,
    lineHeight: 24,
    minHeight: 120,
  },
  charCount: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
});
