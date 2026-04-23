import { z } from 'zod';

export const walletSelectionSchema = z.object({
  walletType: z.enum(['snak', 'external'], {
    invalid_type_error: "Debes seleccionar un tipo de billetera",
  }),
});

// Acumulamos el schema! Ahora exige la billetera (fase 1) y el email + terminos (fase 2)
export const emailLinkSchema = walletSelectionSchema.extend({
  email: z.string().email('Debes ingresar un email válido'),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

// Fase 3: Código de verificación
export const verificationCodeSchema = emailLinkSchema.extend({
  verificationCode: z.string().length(5, 'Código de verificación incompleto'),
});

export const setCredentialsSchema = z
  .object({
    username: z
      .string()
      .min(5, 'Username must be at least 5 characters')
      .max(10, 'Username must be at most 10 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[^a-zA-Z0-9]/, 'Password must include at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

// El esquema final para useForm. Exige los campos base pero permite que se llenen por fases
export const signUpWizardSchema = verificationCodeSchema.extend({
  username: z.string().optional(),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export type SignUpWizardValues = z.infer<typeof signUpWizardSchema>;

export interface SignUpParams {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  status: string;
  message: string;
  code: number;
  data: {
    username: string;
    email: string;
    password: string;
  }
}