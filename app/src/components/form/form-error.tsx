import { StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

export function FormError({ message }: { message: string | null }) {
  const theme = useTheme();

  if (!message) return null;

  return (
    <Text
      variant="bodyMedium"
      accessibilityRole="alert"
      style={[styles.error, { color: theme.colors.error }]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    marginBottom: 12,
  },
});
