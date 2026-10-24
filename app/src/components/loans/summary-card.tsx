import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { formatCurrency } from "@/lib/format";
import type { LoanSummary } from "@/types/api";

export function SummaryCard({ summary }: { summary: LoanSummary | null }) {
  const theme = useTheme();
  const format = (amount?: number) => (summary && amount !== undefined ? formatCurrency(amount) : "—");
  const outstanding = summary ? summary.total_lent - summary.total_repaid : undefined;

  return (
    <Card mode="contained" style={{ backgroundColor: theme.colors.primaryContainer }}>
      <Card.Content>
        <Text variant="labelLarge" style={{ color: theme.colors.onPrimaryContainer }}>
          Yet to be repaid
        </Text>
        <Text
          variant="displaySmall"
          style={[styles.outstanding, { color: theme.colors.onPrimaryContainer }]}
        >
          {format(outstanding)}
        </Text>

        <View style={styles.stats}>
          <SummaryStat label="Total lent" value={format(summary?.total_lent)} />
          <SummaryStat label="Total repaid" value={format(summary?.total_repaid)} />
          <SummaryStat
            label="Overdue"
            value={format(summary?.overdue_amount)}
            highlight={!!summary?.overdue_amount}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

interface SummaryStatProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SummaryStat({ label, value, highlight }: SummaryStatProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.stat,
        { backgroundColor: highlight ? theme.colors.errorContainer : theme.colors.surface },
      ]}
    >
      <Text
        variant="labelMedium"
        style={{ color: highlight ? theme.colors.onErrorContainer : theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
      <Text
        variant="titleMedium"
        style={{ color: highlight ? theme.colors.onErrorContainer : theme.colors.onSurface }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outstanding: {
    fontWeight: "700",
    marginTop: 4,
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  stat: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 2,
  },
});
