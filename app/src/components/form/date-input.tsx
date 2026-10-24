import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { DatePickerModal, type DatePickerModalSingleProps } from "react-native-paper-dates";
import { formatDate } from "@/lib/date";

interface DateInputProps {
  label: string;
  value?: Date;
  onChange: (date: Date) => void;
  onBlur?: () => void;
  errorMessage?: string;
  validRange?: DatePickerModalSingleProps["validRange"];
  disabled?: boolean;
}

export function DateInput({
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
  validRange,
  disabled,
}: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? formatDate(value) : "not set"}`}
        disabled={disabled}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.noPointer}>
          <TextInput
            mode="outlined"
            label={label}
            value={value ? formatDate(value) : ""}
            placeholder="Select a date"
            editable={false}
            disabled={disabled}
            error={!!errorMessage}
            right={<TextInput.Icon icon="calendar" accessible={false} accessibilityRole="none" />}
          />
        </View>
      </Pressable>
      <HelperText type="error" visible={!!errorMessage} style={styles.helper}>
        {errorMessage}
      </HelperText>
      <DatePickerModal
        locale="en"
        mode="single"
        label={label}
        visible={isOpen}
        date={value}
        validRange={validRange}
        onDismiss={close}
        onConfirm={({ date }) => {
          if (date) onChange(date);
          close();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noPointer: {
    pointerEvents: "none",
  },
  helper: {
    minHeight: 24,
  },
});
