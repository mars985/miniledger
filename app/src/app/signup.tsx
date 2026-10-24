import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, TextInput } from "react-native-paper";

import { AuthScreen } from "@/components/auth/auth-screen";
import { OtpForm } from "@/components/auth/otp-form";
import { FormError } from "@/components/form/form-error";
import { FormTextInput } from "@/components/form/form-text-input";

import { MAX_NAME_LENGTH, PHONE_LENGTH } from "@/constants/validation";
import { useAuth } from "@/context/auth-context";
import { getErrorMessage } from "@/lib/api";
import { signupDetailsSchema, type SignupDetails } from "@/schemas/auth.schema";
import { register, sendOtp } from "@/services/auth.service";

export default function SignupScreen() {
  const { signIn } = useAuth();
  const [details, setDetails] = useState<SignupDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(signupDetailsSchema),
    defaultValues: { name: "", phone: "" },
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
      title="Create account"
      subtitle={details ? `Hi ${details.name}, verify your phone number` : "Sign up with your name and phone number"}
      footer={
        <Link href="/login" replace asChild>
          <Button style={{ marginTop: 16 }}>Already have an account? Log in</Button>
        </Link>
      }
    >
      {details ? (
        <OtpForm
          phone={details.phone}
          submitLabel="Create account"
          onVerify={async (otp) => signIn(await register(details.phone, details.name, otp))}
          onResend={() => sendOtp(details.phone)}
          onChangeNumber={() => setDetails(null)}
        />
      ) : (
        <>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
              <FormTextInput
                ref={ref}
                label="Your name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={fieldState.error?.message}
                maxLength={MAX_NAME_LENGTH}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("phone")}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange, onBlur, ref }, fieldState }) => (
              <FormTextInput
                ref={ref}
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
