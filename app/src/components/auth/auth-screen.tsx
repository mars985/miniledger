import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthScreenProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export function AuthScreen({ title, subtitle, footer, children }: AuthScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text variant="displaySmall" style={[styles.brand, { color: theme.colors.primary }]}>
              MiniLedger
            </Text>
            <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
              Keep track of money you lend to friends
            </Text>

            <Surface style={styles.card} elevation={1}>
              <Text variant="headlineSmall">{title}</Text>
              <Text
                variant="bodyMedium"
                style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
              >
                {subtitle}
              </Text>
              {children}
            </Surface>

            {footer}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  brand: {
    textAlign: "center",
    fontWeight: "700",
  },
  tagline: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
  },
});
