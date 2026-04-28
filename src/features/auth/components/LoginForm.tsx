'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../schemas';
import { useLogin } from '../hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginForm = () => {
  const router = useRouter();
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: () => {
        router.push('/watch');
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Welcome Text */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-widest mb-8 text-center uppercase font-heading">
        Welcome to Snak
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="w-full">
          <Controller
            name="identifier"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="E-MAIL OR USERNAME"
                className="w-full h-14 bg-snak-purple-dark/60 border-transparent focus-visible:ring-snak-pink rounded-xl px-4 text-center text-sm tracking-widest placeholder:text-white/50 text-white"
              />
            )}
          />
          {errors.identifier && (
            <p className="text-red-400 text-xs mt-1 text-center">{errors.identifier.message}</p>
          )}
        </div>

        <div className="w-full">
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
        </div>

        {isError && (
          <p className="text-red-400 text-sm text-center font-medium mt-2">
            {error?.message || 'Error al iniciar sesión'}
          </p>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-gradient-to-r from-snak-blue-sky to-snak-blue-aqua rounded-full text-sm font-bold tracking-widest text-white hover:opacity-90 border-0"
          >
            {isPending ? 'LOGGING IN...' : 'LOG IN'}
          </Button>
        </div>
      </form>
    </div>
  );
};

