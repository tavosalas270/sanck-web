'use server';

import { cookies } from 'next/headers';
import { LoginResponse, BadLoginResponse, LoginParams, SignUpParams, SignUpResponse } from '../schemas';

export const loginWithCredentials = async ({ email, username, password }: LoginParams): Promise<LoginResponse> => {
  // Configured to fail with 401 on incorrect credentials according to rules
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const bodyData: Record<string, string> = { password };
  if (email) bodyData.email = email;
  if (username) bodyData.username = username;

  const response = await fetch(`${baseUrl}/api/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });

  if (!response.ok) {
    throw { status: response.status } as BadLoginResponse;
  }

  const data = await response.json();

  const cookieStore = await cookies();
  
  cookieStore.set('access', data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  
  cookieStore.set('refresh', data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return {
    token: data,
    status: response.status
  }
};

export const signUp = async ({ username, email, password }: SignUpParams): Promise<SignUpResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${baseUrl}/api/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw { status: response.status } as BadLoginResponse;
  }

  const data = await response.json();

  return data
};