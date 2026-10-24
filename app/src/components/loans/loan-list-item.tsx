import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { LoanStatusBadge } from "@/components/loans/loan-status-badge";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { getDueDescription, getLoanState } from "@/lib/loan";
import type { Loan } from "@/types/api";

interface LoanListItemProps {
  loan: Loan;
  onPress: (loan: Loan) => void;
}

export function LoanListItem({ loan, onPress }: LoanListItemProps) {
  const { colors } = useTheme();
  const state = getLoanState(loan);
  const isOverdue = state === "overdue";

  const textColor = isOverdue ? colors.onErrorContainer : colors.onSurface;
  const mutedColor = isOverdue ? colors.onErrorContainer : colors.onSurfaceVariant;

  return (
    <Card
      mode="outlined"
      onPress={() => onPress(loan)}
      accessibilityLabel={`${loan.friend_name}, ${formatCurrency(loan.amount)}, ${getDueDescription(loan)}`}
      style={[
        styles.card,
        isOverdue && {
          backgroundColor: colors.errorContainer,
          borderColor: colors.error,
          borderLeftWidth: 4,
        },
      ]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.info}>
          <Text variant="titleMedium" numberOfLines={1} style={{ color: textColor }}>
            {loan.friend_name}
          </Text>
          <Text variant="bodySmall" style={{ color: mutedColor }}>
            Lent {formatDate(loan.lent_on)}
          </Text>
          <Text
            variant="bodySmall"
            style={[{ color: isOverdue ? colors.error : mutedColor }, isOverdue && styles.bold]}
          >
            {getDueDescription(loan)}
          </Text>
        </View>

        <View style={styles.trailing}>
          <Text
            variant="titleMedium"
            style={[
              styles.amount,
              { color: textColor },
              state === "repaid" && { color: colors.onSurfaceVariant },
            ]}
          >
            {formatCurrency(loan.amount)}
          </Text>
          <LoanStatusBadge state={state} />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  trailing: {
    alignItems: "flex-end",
    gap: 6,
  },
  amount: {
    fontWeight: "700",
  },
  bold: {
    fontWeight: "700",
  },
});
