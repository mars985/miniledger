import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";
import { AuthScreen } from "@/components/auth/auth-screen";
import { OtpForm } from "@/components/auth/otp-form";
import { FormError } from "@/components/form/form-error";
import { FormTextInput } from "@/components/form/form-text-input";
import { PHONE_LENGTH } from "@/constants/validation";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/api";
import { loginDetailsSchema, type LoginDetails } from "@/schemas/auth.schema";
import { login, sendOtp } from "@/services/auth.service";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [details, setDetails] = useState<LoginDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginDetailsSchema),
    defaultValues: { phone: "" },
  });

  const requestOtp = handleSubmit(async (values) => {
    setError(null);
    try {
      await sendOtp(values.phone);
      setDetails(values);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  });

  return (
    <AuthScreen
      title="Log in"
      subtitle={details ? "Verify your phone number" : "Log in with your phone number"}
      footer={
        <Link href="/signup" replace asChild>
          <Button style={{ marginTop: 16 }}>New here? Create an account</Button>
        </Link>
      }
    >
      {details ? (
        <OtpForm
          phone={details.phone}
          submitLabel="Log in"
          onVerify={async (otp) => signIn(await login(details.phone, otp))}
          onResend={() => sendOtp(details.phone)}
          onChangeNumber={() => setDetails(null)}
        />
      ) : (
        <>
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur }, fieldState }) => (
              <FormTextInput
                label="Phone number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                left={<TextInput.Affix text="+91" />}
                keyboardType="phone-pad"
                maxLength={PHONE_LENGTH}
                autoComplete="tel"
                textContentType="telephoneNumber"
                onSubmitEditing={requestOtp}
              />
            )}
          />

          <FormError message={error} />

          <Button
            mode="contained"
            onPress={requestOtp}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Send OTP
          </Button>
        </>
      )}
    </AuthScreen>
  );
}
