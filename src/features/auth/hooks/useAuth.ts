import { useMutation } from '@tanstack/react-query';
import { loginWithCredentials, signUp } from '../services';
import { LoginFormValues, LoginParams, SignUpParams } from '../schemas';
import { useSignUpContext } from '../context';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormValues) => {
      const { identifier, password } = data;
      const isEmail = identifier.includes('@');

      const loginParams: LoginParams = {
        password,
        ...(isEmail ? { email: identifier } : { username: identifier })
      };

      return loginWithCredentials(loginParams);
    },
    onSuccess: (data) => {
      console.log('Login succesful, token:', data.token);
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    }
  });
};

export const useSignUpForm = () => {
  const { setTabSelected, setSubSectionSelected, setSignUpStep } = useSignUpContext();

  return useMutation({
    mutationFn: ({ username, email, password }: SignUpParams) => signUp({ username, email, password }),
    onSuccess: () => {
      // Reset signup flow and switch to login tab
      setSignUpStep(1);
      setSubSectionSelected('create');
      setTabSelected('login');
    },
    onError: (error) => {
      console.error('Error in sign up:', error);
    },
  });
};
