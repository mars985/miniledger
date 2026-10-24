import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import type { LoanState } from "@/lib/loan";

const LABELS: Record<LoanState, string> = {
  overdue: "Overdue",
  repaid: "Repaid",
  due: "Unpaid",
};

export function LoanStatusBadge({ state }: { state: LoanState }) {
  const { colors } = useTheme();

  const palette = {
    overdue: { background: colors.error, text: colors.onError },
    repaid: { background: colors.secondaryContainer, text: colors.onSecondaryContainer },
    due: { background: colors.surfaceVariant, text: colors.onSurfaceVariant },
  }[state];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text variant="labelSmall" style={{ color: palette.text }}>
        {LABELS[state]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
