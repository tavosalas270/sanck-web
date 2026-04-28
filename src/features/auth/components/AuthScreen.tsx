'use client';

import Image from 'next/image';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginForm } from './LoginForm';
import { SignUpFlow } from './SignUpFlow';
import { HelpModal } from './HelpModal';
import { useSignUpContext } from '../context';

export const AuthScreen = () => {
  const { tabSelected, setTabSelected } = useSignUpContext();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-snak-purple-dark via-snak-purple-medium to-snak-pink text-white font-sans">
      {/* Top Section */}
      <div className="w-full max-w-sm lg:max-w-lg flex flex-col items-center">
        {/* Logo */}
        <div className="mb-10 pb-1">
          <Image
            src="/icons/snack_white.svg"
            alt="SNAK! Logo"
            width={160}
            height={60}
            className="w-full max-w-[160px] h-auto"
            priority
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 w-full justify-center">
          <Button
            variant="ghost"
            onClick={() => setTabSelected('login')}
            className={`px-8 py-6 rounded-full text-lg font-bold transition-colors uppercase ${tabSelected === 'login'
              ? 'bg-snak-pink text-white hover:bg-snak-pink hover:text-white'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            LOGIN
          </Button>
          <Button
            variant="ghost"
            onClick={() => setTabSelected('sign')}
            className={`px-8 py-6 rounded-full text-lg font-bold transition-colors uppercase ${tabSelected === 'sign'
              ? 'bg-snak-pink text-white hover:bg-snak-pink hover:text-white'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            SIGN UP
          </Button>
        </div>

        {/* Render Active View */}
        <div className="w-full">
          {tabSelected === 'login' ? <LoginForm /> : <SignUpFlow onLoginRedirect={() => setTabSelected('login')} />}
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col items-center gap-3 mt-6 md:mt-8 mb-2 shrink-0">
        <HelpModal>
          <Button variant="outline" size="icon" className="rounded-full bg-transparent border-white hover:bg-white/10 hover:text-white size-10">
            <HelpCircle className="text-white size-5" strokeWidth={1.5} />
          </Button>
        </HelpModal>
        <p className="text-[10px] tracking-wider text-white/80">
          © 2023 SNAK. All rights reserved.
        </p>
      </div>
    </div>
  );
};
