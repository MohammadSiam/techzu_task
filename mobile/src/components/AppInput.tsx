import { TextInput, StyleSheet, TextInputProps, View, Text, ViewStyle } from "react-native";
import { Colors, FontSize, Spacing } from "../constants/theme";

interface AppInputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
}

export default function AppInput({ label, style, containerStyle, ...props }: AppInputProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
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
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
});
