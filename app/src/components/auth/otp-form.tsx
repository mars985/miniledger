import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { FormError } from "@/components/form/form-error";
import { FormTextInput } from "@/components/form/form-text-input";
import { OTP_LENGTH } from "@/constants/validation";
import { getErrorMessage } from "@/lib/api";
import { otpSchema } from "@/schemas/auth.schema";

interface OtpFormProps {
  phone: string;
  submitLabel: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeNumber: () => void;
}

export function OtpForm({ phone, submitLabel, onVerify, onResend, onChangeNumber }: OtpFormProps) {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const verify = handleSubmit(async ({ otp }) => {
    setError(null);
    setNotice(null);
    try {
      await onVerify(otp);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  const resend = async () => {
    setError(null);
    setNotice(null);
    setIsResending(true);
    try {
      await onResend();
      setNotice("A new OTP has been sent.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View>
      <Text variant="bodyMedium" style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}>
        Enter the {OTP_LENGTH}-digit code sent to +91 {phone}. In this demo, the code is printed in
        the backend server log.
      </Text>

      <Controller
        control={control}
        name="otp"
        render={({ field: { value, onChange, onBlur }, fieldState }) => (
          <FormTextInput
            label="OTP"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            errorMessage={fieldState.error?.message}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            autoFocus
            onSubmitEditing={verify}
          />
        )}
      />

      <FormError message={error} />
      {notice && (
        <Text variant="bodyMedium" style={[styles.notice, { color: theme.colors.primary }]}>
          {notice}
        </Text>
      )}

      <Button mode="contained" onPress={verify} loading={isSubmitting} disabled={isSubmitting}>
        {submitLabel}
      </Button>

      <View style={styles.secondaryActions}>
        <Button onPress={onChangeNumber} disabled={isSubmitting}>
          Change number
        </Button>
        <Button onPress={resend} loading={isResending} disabled={isResending || isSubmitting}>
          Resend OTP
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginBottom: 16,
  },
  notice: {
    marginBottom: 12,
  },
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
