import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Divider, Portal, Text, useTheme } from "react-native-paper";
import { FormError } from "@/components/form/form-error";
import { LoanStatusBadge } from "@/components/loans/loan-status-badge";
import { getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { getDueDescription, getLoanState } from "@/lib/loan";
import { repayLoan } from "@/services/loan.service";
import type { Loan } from "@/types/api";

interface LoanDetailsDialogProps {
  loan: Loan | null;
  onDismiss: () => void;
  onRepaid: () => void;
}

export function LoanDetailsDialog({ loan, onDismiss, onRepaid }: LoanDetailsDialogProps) {
  const { colors } = useTheme();
  const [isRepaying, setIsRepaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isRepaying) return;
    setError(null);
    onDismiss();
  };

  const markRepaid = async () => {
    if (!loan) return;
    setError(null);
    setIsRepaying(true);
    try {
      await repayLoan(loan.id);
      onRepaid();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsRepaying(false);
    }
  };

  const state = loan ? getLoanState(loan) : null;

  return (
    <Portal>
      <Dialog visible={!!loan} onDismiss={close} style={styles.dialog}>
        {loan && state && (
          <>
            <Dialog.Title numberOfLines={2}>{loan.friend_name}</Dialog.Title>
            <Dialog.Content>
              <View style={styles.amountRow}>
                <Text variant="headlineMedium" style={styles.amount}>
                  {formatCurrency(loan.amount)}
                </Text>
                <LoanStatusBadge state={state} />
              </View>
              <Text
                variant="bodyMedium"
                style={{ color: state === "overdue" ? colors.error : colors.onSurfaceVariant }}
              >
                {getDueDescription(loan)}
              </Text>

              <Divider style={styles.divider} />

              <DetailRow label="Lent on" value={formatDate(loan.lent_on)} />
              <DetailRow label="Due date" value={loan.due_date ? formatDate(loan.due_date) : "—"} />
              <DetailRow
                label="Repaid on"
                value={loan.repaid_at ? formatDate(loan.repaid_at) : "Not yet"}
              />
              <DetailRow label="Recorded on" value={formatDate(loan.created_at)} />

              <View style={styles.errorSpacing}>
                <FormError message={error} />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={close} disabled={isRepaying}>
                Close
              </Button>
              {state !== "repaid" && (
                <Button
                  mode="contained"
                  icon="check"
                  onPress={markRepaid}
                  loading={isRepaying}
                  disabled={isRepaying}
                >
                  Mark repaid
                </Button>
              )}
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </Portal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.detailRow}>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text variant="bodyMedium">{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  amount: {
    fontWeight: "700",
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  errorSpacing: {
    marginTop: 12,
  },
});
