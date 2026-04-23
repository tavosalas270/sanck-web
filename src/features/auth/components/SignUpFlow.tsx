'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { walletSelectionSchema, emailLinkSchema, verificationCodeSchema, setCredentialsSchema, SignUpWizardValues } from '../schemas/signup.schema';
import { useSignUpContext } from '../context';
import { useSignUpForm } from '../hooks';

interface SignUpFlowProps {
  onLoginRedirect?: () => void;
}

export const SignUpFlow = ({ onLoginRedirect }: SignUpFlowProps) => {
  const {
    walletData,
    linkEmailData,
    verifyCodeData,
    setCredentialsData,
    signUpStep: step,
    setSignUpStep: setStep,
    setWalletData,
    setLinkEmailData,
    setVerifyCodeData,
    setSetCredentialsData
  } = useSignUpContext();

  const signUpMutation = useSignUpForm();

  const totalSteps = 4;

  // Esquemas dinámicos por fase 
  // Ahora usan herencia acumulativa desde signup.schema.ts
  const schemas = [
    walletSelectionSchema,
    emailLinkSchema,
    verificationCodeSchema,
    setCredentialsSchema,
  ] as const;

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SignUpWizardValues>({
    resolver: zodResolver(schemas[step - 1] as any),
    mode: 'onTouched',
    defaultValues: {
      walletType: walletData.walletType,
      email: linkEmailData.email,
      acceptedTerms: linkEmailData.acceptedTerms,
      verificationCode: verifyCodeData.verificationCode,
      username: setCredentialsData.username,
      password: setCredentialsData.password,
      confirmPassword: setCredentialsData.confirmPassword,
    }
  });

  const walletType = watch('walletType');
  const email = watch('email');
  const acceptedTerms = watch('acceptedTerms');
  const verificationCode = watch('verificationCode');

  const onNextStep = (data: SignUpWizardValues) => {
    // Guardar datos en el contexto según el paso actual
    if (step === 1) {
      setWalletData({ walletType: data.walletType });
    } else if (step === 2) {
      setLinkEmailData({
        walletType: data.walletType,
        email: data.email!,
        acceptedTerms: data.acceptedTerms!,
      });
    } else if (step === 3) {
      setVerifyCodeData({
        walletType: data.walletType,
        email: data.email!,
        acceptedTerms: data.acceptedTerms!,
        verificationCode: data.verificationCode!,
      });
    } else if (step === 4) {
      setSetCredentialsData({
        username: data.username!,
        password: data.password!,
        confirmPassword: data.confirmPassword!,
      });

      // Aquí se llamaría a la mutación final de registro
      signUpMutation.mutate({
        username: data.username!,
        email: linkEmailData.email,
        password: data.password!,
      });
    }

    if (step < totalSteps) {
      console.log(`Phase ${step} completed:`, data);
      setStep(step + 1);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Back Button */}
      {step > 1 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="absolute top-[52px] left-6 size-12 rounded-full bg-[#fcecf5] flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="text-snak-pink" size={24} strokeWidth={2} />
        </button>
      )}

      {/* Progress Dots */}
      <div className="flex items-center mb-10 mt-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const current = idx + 1;
          const isActive = current === step;
          const isPast = current < step;
          return (
            <React.Fragment key={current}>
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div className="absolute size-[22px] rounded-full border border-snak-pink" />
                )}
                <div
                  className={`size-2.5 rounded-full z-10 ${isPast ? 'bg-snak-pink' : 'bg-white'}`}
                />
              </div>
              {/* Línea horizontal */}
              {current < totalSteps && (
                <div className={`h-0.5 w-6 ${isPast ? 'bg-snak-pink' : 'bg-transparent'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onNextStep)} className="w-full space-y-8 flex flex-col items-center">
          <h2 className="text-[1.35rem] leading-8 font-bold tracking-widest text-center uppercase font-heading px-2">
            Which type of wallet would you like to use?
          </h2>

          <div className="w-full space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setValue('walletType', 'snak', { shouldValidate: true })}
              className={`w-full h-[68px] rounded-full bg-[#18053a] text-[13px] font-bold tracking-widest text-white hover:bg-[#20094b] hover:text-white transition-all ${walletType === 'snak'
                ? 'border-snak-pink border-2'
                : 'border-white/20 border'
                }`}
            >
              CREATE A SNAK WALLET
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setValue('walletType', 'external', { shouldValidate: true })}
              className={`w-full h-[68px] rounded-full bg-[#18053a] text-[13px] font-bold tracking-widest text-white hover:bg-[#20094b] hover:text-white transition-all ${walletType === 'external'
                ? 'border-snak-pink border-2'
                : 'border-white/20 border'
                }`}
            >
              USE MY OWN WALLET
            </Button>
          </div>

          <div className="w-full pt-2">
            <Button
              type="submit"
              disabled={!walletType}
              className="w-full h-14 bg-gradient-to-r from-snak-blue-sky to-snak-blue-aqua rounded-full text-sm font-bold tracking-widest text-white hover:opacity-90 border-0 disabled:opacity-50"
            >
              CONTINUE
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onNextStep)} className="w-full space-y-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-[1.35rem] leading-8 font-bold tracking-widest text-center uppercase font-heading px-1">
            Link your e-mail address to your new snak wallet
          </h2>

          <p className="text-center text-[13px] sm:text-sm px-2 mt-4 leading-6 text-white text-opacity-95">
            Your e-mail address will be directly associated to your new SNAK wallet, and it will be used as your main ID to use this App.
          </p>

          <div className="w-full pt-6">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  type="email"
                  placeholder="E-MAIL"
                  className="w-full h-14 bg-snak-purple-dark/60 border-transparent focus-visible:ring-snak-pink rounded-xl px-4 text-center text-sm tracking-widest placeholder:text-white/50 text-white"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1 text-center">{errors.email.message}</p>
            )}
          </div>

          <div className="w-full flex items-start gap-4 pt-4 px-1">
            <Controller
              name="acceptedTerms"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                  className="mt-1 size-[18px] rounded-[4px] border-2 border-white data-[state=checked]:bg-white data-[state=checked]:text-snak-pink shrink-0"
                />
              )}
            />
            <div className="flex-1 text-[13px] leading-[1.35rem]">
              I have read and accept SNAK's{' '}
              <a href="#" className="text-snak-pink hover:underline">privacy policy</a>{' '}
              and{' '}
              <a href="#" className="text-snak-pink hover:underline">terms and conditions</a>.
            </div>
          </div>
          {errors.acceptedTerms && (
            <p className="text-red-400 text-xs text-center w-full">{errors.acceptedTerms.message}</p>
          )}

          <div className="w-full">
            <Button
              type="submit"
              disabled={!email || !acceptedTerms}
              className="w-full h-14 bg-gradient-to-r from-snak-blue-sky to-snak-blue-aqua rounded-full text-sm font-bold tracking-widest text-white hover:opacity-90 border-0 disabled:opacity-50"
            >
              CONTINUE
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onNextStep)} className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-[1.35rem] leading-8 font-bold tracking-widest text-center uppercase font-heading px-1">
            Please enter your verification code
          </h2>

          <p className="text-center text-[13px] sm:text-sm px-2 mt-4 mb-4 leading-6 text-white text-opacity-95">
            We have sent you a verification code to the selected e-mail address, please fill in the code in the fields below.
          </p>

          <div className="w-full py-4 flex justify-center">
            <Controller
              name="verificationCode"
              control={control}
              render={({ field }) => (
                <InputOTP maxLength={5} value={field.value || ''} onChange={field.onChange}>
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="size-12 sm:size-14 bg-[#20054bb3] border-transparent rounded-lg text-lg ring-snak-pink data-[active=true]:border-snak-pink text-white"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          {errors.verificationCode && (
            <p className="text-red-400 text-xs text-center w-full mt-2 mb-2">{errors.verificationCode.message}</p>
          )}

          <div className="w-full pt-4">
            <Button
              type="submit"
              disabled={!verificationCode || verificationCode.length < 5}
              className="w-full h-14 bg-gradient-to-r from-snak-blue-sky to-snak-blue-aqua rounded-full text-sm font-bold tracking-widest text-white hover:opacity-90 border-0 disabled:opacity-50"
            >
              CONTINUE
            </Button>
          </div>

          <button type="button" className="text-snak-pink font-bold tracking-widest text-[11px] mt-8 hover:opacity-80 transition-opacity uppercase">
            Request a new code
          </button>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit(onNextStep)} className="w-full space-y-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <h2 className="text-[1.35rem] leading-8 font-bold tracking-widest text-center uppercase font-heading px-1">
            Create your credentials
          </h2>

          <div className="w-full pt-4 space-y-4">
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="USERNAME"
                  className="w-full h-14 bg-snak-purple-dark/60 border-transparent focus-visible:ring-snak-pink rounded-xl px-4 text-center text-sm tracking-widest placeholder:text-white/50 text-white"
                />
              )}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1 text-center">{errors.username.message}</p>
            )}

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="PASSWORD"
                  className="w-full h-14 bg-snak-purple-dark/60 border-transparent focus-visible:ring-snak-pink rounded-xl px-4 text-center text-sm tracking-widest placeholder:text-white/50 text-white"
                />
              )}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1 text-center">{errors.password.message}</p>
            )}

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  className="w-full h-14 bg-snak-purple-dark/60 border-transparent focus-visible:ring-snak-pink rounded-xl px-4 text-center text-sm tracking-widest placeholder:text-white/50 text-white"
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1 text-center">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="w-full pt-6">
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-snak-blue-sky to-snak-blue-aqua rounded-full text-sm font-bold tracking-widest text-white hover:opacity-90 border-0"
            >
              FINISH REGISTRATION
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
