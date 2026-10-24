import type { ComponentRef, Ref } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, TextInput, type TextInputProps } from "react-native-paper";

type FormTextInputProps = Omit<TextInputProps, "error" | "mode"> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  errorMessage?: string;
};

export function FormTextInput({ ref, errorMessage, ...inputProps }: FormTextInputProps) {
  return (
    <View>
      <TextInput ref={ref} mode="outlined" error={!!errorMessage} {...inputProps} />
      <HelperText type="error" visible={!!errorMessage} style={styles.helper}>
        {errorMessage}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  helper: {
    minHeight: 24,
  },
});
