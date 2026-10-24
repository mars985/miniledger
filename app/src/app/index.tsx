import { isCancel } from "axios";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Button,
  FAB,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddLoanDialog } from "@/components/loans/add-loan-dialog";
import { LoanDetailsDialog } from "@/components/loans/loan-details-dialog";
import { LoanListItem } from "@/components/loans/loan-list-item";
import { SummaryCard } from "@/components/loans/summary-card";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/api";
import { getLoanSummary, getLoans } from "@/services/loan.service";
import type { Loan, LoanStatus, LoanSummary } from "@/types/api";

const STATUS_OPTIONS: { value: LoanStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "repaid", label: "Repaid" },
];

const EMPTY_MESSAGES: Record<LoanStatus, string> = {
  all: "No loans yet. Tap \"Add loan\" to record one.",
  unpaid: "Nothing pending. Everyone has paid you back.",
  repaid: "No repaid loans yet.",
};

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const [status, setStatus] = useState<LoanStatus>("all");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([getLoans(status, controller.signal), getLoanSummary(controller.signal)])
      .then(([nextLoans, nextSummary]) => {
        setLoans(nextLoans);
        setSummary(nextSummary);
        setError(null);
      })
      .catch((err) => {
        if (!isCancel(err)) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [status, refreshKey]);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const refresh = () => {
    startLoading();
    setRefreshKey((key) => key + 1);
  };

  const changeStatus = (value: string) => {
    startLoading();
    setStatus(value as LoanStatus);
  };

  const handleLoanAdded = () => {
    setIsAddDialogOpen(false);
    refresh();
  };

  const handleLoanRepaid = () => {
    setSelectedLoan(null);
    refresh();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="MiniLedger" />
        <Appbar.Action icon="logout" accessibilityLabel="Log out" onPress={signOut} />
      </Appbar.Header>

      <FlatList
        data={loans}
        keyExtractor={(loan) => String(loan.id)}
        renderItem={({ item }) => <LoanListItem loan={item} onPress={setSelectedLoan} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 96 }]}
        refreshControl={<RefreshControl refreshing={isLoading && loans.length > 0} onRefresh={refresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="titleLarge">Hi, {user?.name}</Text>

            <SummaryCard summary={summary} />

            <SegmentedButtons
              value={status}
              onValueChange={changeStatus}
              buttons={STATUS_OPTIONS.map((option) => ({ ...option, showSelectedCheck: true }))}
            />

            {error && (
              <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer }]}>
                <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                  {error}
                </Text>
                <Button compact onPress={refresh} textColor={theme.colors.onErrorContainer}>
                  Retry
                </Button>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.empty} />
          ) : error ? null : (
            <Text
              variant="bodyLarge"
              style={[styles.empty, styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
            >
              {EMPTY_MESSAGES[status]}
            </Text>
          )
        }
      />

      <FAB
        icon="plus"
        label="Add loan"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => setIsAddDialogOpen(true)}
      />

      <AddLoanDialog
        visible={isAddDialogOpen}
        onDismiss={() => setIsAddDialogOpen(false)}
        onAdded={handleLoanAdded}
      />

      <LoanDetailsDialog
        loan={selectedLoan}
        onDismiss={() => setSelectedLoan(null)}
        onRepaid={handleLoanRepaid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  header: {
    gap: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  errorText: {
    flex: 1,
  },
  empty: {
    marginTop: 32,
  },
  emptyText: {
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
  },
});
