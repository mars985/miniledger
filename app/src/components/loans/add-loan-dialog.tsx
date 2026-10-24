import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { DateInput } from "@/components/form/date-input";
import { FormError } from "@/components/form/form-error";
import { FormTextInput } from "@/components/form/form-text-input";
import { MAX_FRIEND_NAME_LENGTH } from "@/constants/validation";
import { getErrorMessage } from "@/lib/api";
import { startOfToday, toISODate } from "@/lib/date";
import { addLoanSchema, type AddLoanFormInput } from "@/schemas/loan.schema";
import { addLoan } from "@/services/loan.service";

interface AddLoanDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onAdded: () => void;
}

const getDefaultValues = (): AddLoanFormInput => ({
  friend_name: "",
  amount: "",
  lent_on: startOfToday(),
  due_date: undefined as unknown as Date,
});

export function AddLoanDialog({ visible, onDismiss, onAdded }: AddLoanDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(addLoanSchema),
    defaultValues: getDefaultValues(),
  });

  const lentOn = useWatch({ control, name: "lent_on" });

  const close = () => {
    if (isSubmitting) return;
    reset(getDefaultValues());
    setError(null);
    onDismiss();
  };

  const submit = handleSubmit(async (values) => {
    setError(null);
    try {
      await addLoan({
        friend_name: values.friend_name,
        amount: values.amount,
        lent_on: toISODate(values.lent_on),
        due_date: toISODate(values.due_date),
      });
      reset(getDefaultValues());
      onAdded();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={close} style={styles.dialog}>
        <Dialog.Title>Add loan</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.form}>
            <Controller
              control={control}
              name="friend_name"
              render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
                <FormTextInput
                  ref={ref}
                  label="Friend's name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={fieldState.error?.message}
                  maxLength={MAX_FRIEND_NAME_LENGTH}
                  autoCapitalize="words"
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={() => setFocus("amount")}
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
                <FormTextInput
                  ref={ref}
                  label="Amount"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={fieldState.error?.message}
                  left={<TextInput.Affix text="₹" />}
                  keyboardType="number-pad"
                />
              )}
            />

            <Controller
              control={control}
              name="lent_on"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <DateInput
                  label="Lent on"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMessage={fieldState.error?.message}
                  validRange={{ endDate: startOfToday() }}
                />
              )}
            />

            <Controller
              control={control}
              name="due_date"
              render={({ field: { value, onChange, onBlur }, fieldState }) => (
                <DateInput
                  label="Due date"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  errorMessage={fieldState.error?.message}
                  validRange={{ startDate: lentOn }}
                />
              )}
            />

            <FormError message={error} />
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={close} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button mode="contained" onPress={submit} loading={isSubmitting} disabled={isSubmitting}>
            Add loan
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    maxHeight: "90%",
  },
  scrollArea: {
    paddingHorizontal: 0,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
});
